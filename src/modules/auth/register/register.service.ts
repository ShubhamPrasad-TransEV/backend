import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from 'src/email/email.service';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { AddressDto } from './dto/address.dto';
import { Address } from './types/address.type';

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { name, username, password, email, phoneNumber } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { name, username, email, password: hashedPassword, phoneNumber },
    });

    await this.emailService.sendMail(
      user.email,
      'Welcome to Our Service',
      'Thank you for registering!',
    );

    return user;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const {
      id,
      username,
      roleId,
      companyName,
      contactPerson,
      phoneNumber,
      email,
      description,
    } = updateUserDto;

    const userId = parseInt(id.toString(), 10);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const dataToUpdate: any = {
      username: username ?? undefined,
      email: email ?? undefined,
      isSeller: roleId === 3 ? true : undefined,
      companyName: companyName ?? undefined,
      contactPerson: contactPerson ?? undefined,
      phoneNumber: phoneNumber ?? undefined,
      description: description ?? undefined,
    };

    if (roleId) {
      dataToUpdate.role = { connect: { id: roleId } };
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    if (roleId === 3 && !user.isSeller) {
      await this.prisma.seller.create({ data: { id: updatedUser.id } });
    }

    if (user.isSeller && roleId !== 3) {
      await this.prisma.seller.delete({ where: { id: userId } });
    }

    return updatedUser;
  }

  async deleteUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isSeller) {
      await this.prisma.seller.delete({ where: { id: userId } });
    }

    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'User deleted successfully' };
  }

  async getAllSellers() {
    const userDetails = await this.prisma.seller.findMany({
      where: {
        user: {
          role: {
            NOT: { id: 1 },
          },
        },
      },
      select: {
        user: true,
      },
    });

    return userDetails.map((seller) => seller.user);
  }

  async getSellerById(id: number) {
    const seller = await this.prisma.seller.findFirst({
      where: {
        id,
        user: {
          role: {
            NOT: { id: 1 },
          },
        },
      },
      include: { user: true },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found or is an admin');
    }

    return seller;
  }

  async updateSeller(updateSellerDto: UpdateSellerDto) {
    const { id, aboutUs, logo } = updateSellerDto;

    if (!id) {
      throw new BadRequestException('Seller ID is required');
    }

    const seller = await this.prisma.seller.findFirst({
      where: {
        id,
        user: {
          role: {
            NOT: { id: 1 },
          },
        },
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found or is an admin');
    }

    const dataToUpdate = {
      aboutUs: aboutUs ?? undefined,
      logo: logo ?? undefined,
    };

    return await this.prisma.seller.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async addAddress(userId: number, addressDto: AddressDto) {
    const user = await this.findOne(userId);

    // Parse `addresses` as an array, initializing it as an empty array if undefined or invalid
    let addresses: Address[] = [];
    try {
      addresses = JSON.parse(user.addresses) || [];
      if (!Array.isArray(addresses)) addresses = [];
    } catch (error) {
      addresses = [];
    }

    if (addresses.some((addr) => addr.identifier === addressDto.identifier)) {
      throw new BadRequestException(
        `Address with identifier "${addressDto.identifier}" already exists.`,
      );
    }

    // Ensure that only the PATCH endpoint can set an address as default
    const addressToAdd = { ...addressDto, default: false };

    addresses.push(addressToAdd);

    return this.prisma.user.update({
      where: { id: userId },
      data: { addresses: JSON.stringify(addresses) },
    });
  }

  async deleteAddress(userId: number, identifier: string) {
    const user = await this.findOne(userId);

    let addresses: Address[] = [];
    try {
      addresses = JSON.parse(user.addresses) || [];
      if (!Array.isArray(addresses)) addresses = [];
    } catch (error) {
      addresses = [];
    }

    const addressIndex = addresses.findIndex(
      (addr) => addr.identifier === identifier,
    );

    if (addressIndex === -1) {
      throw new NotFoundException(
        `Address with identifier ${identifier} not found`,
      );
    }

    addresses.splice(addressIndex, 1);

    return this.prisma.user.update({
      where: { id: userId },
      data: { addresses: JSON.stringify(addresses) },
    });
  }

  async getAllAddresses(userId: number): Promise<Address[]> {
    const user = await this.findOne(userId);
    let addresses: Address[] = [];
    try {
      addresses = JSON.parse(user.addresses) || [];
      if (!Array.isArray(addresses)) addresses = [];
    } catch (error) {
      addresses = [];
    }
    return addresses;
  }

  async getAddressByIdentifier(
    userId: number,
    identifier: string,
  ): Promise<Address> {
    const addresses = await this.getAllAddresses(userId);

    const address = addresses.find((addr) => addr.identifier === identifier);
    if (!address) {
      throw new NotFoundException(
        `Address with identifier ${identifier} not found`,
      );
    }
    return address;
  }

  async updateAddressByIdentifier(
    userId: number,
    identifier: string,
    addressDto: AddressDto,
  ) {
    const user = await this.findOne(userId);

    let addresses: Address[] = [];
    try {
      addresses = JSON.parse(user.addresses) || [];
      if (!Array.isArray(addresses)) addresses = [];
    } catch (error) {
      addresses = [];
    }

    const addressIndex = addresses.findIndex(
      (addr) => addr.identifier === identifier,
    );

    if (addressIndex === -1) {
      throw new NotFoundException(
        `Address with identifier ${identifier} not found`,
      );
    }

    // Prevent updates to the default field except through the setDefaultAddress method
    addresses[addressIndex] = {
      ...addressDto,
      default: addresses[addressIndex].default,
    };

    return this.prisma.user.update({
      where: { id: userId },
      data: { addresses: JSON.stringify(addresses) },
    });
  }

  async setDefaultAddress(userId: number, identifier: string) {
    const user = await this.findOne(userId);

    let addresses: Address[] = [];
    try {
      addresses = JSON.parse(user.addresses) || [];
      if (!Array.isArray(addresses)) addresses = [];
    } catch (error) {
      addresses = [];
    }

    const addressIndex = addresses.findIndex(
      (addr) => addr.identifier === identifier,
    );

    if (addressIndex === -1) {
      throw new NotFoundException(
        `Address with identifier ${identifier} not found`,
      );
    }

    // Set the specified address as default, unsetting any other defaults
    addresses = addresses.map((addr, index) => ({
      ...addr,
      default: index === addressIndex,
    }));

    return this.prisma.user.update({
      where: { id: userId },
      data: { addresses: JSON.stringify(addresses) },
    });
  }

  async getDefaultAddress(userId: number): Promise<Address> {
    const addresses = await this.getAllAddresses(userId);

    const defaultAddress = addresses.find((addr) => addr.default);
    if (!defaultAddress) {
      throw new NotFoundException('No default address found for this user');
    }
    return defaultAddress;
  }
}

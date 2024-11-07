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
import { Address } from './types/address.type'; // Define Address type

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // Register a new user
  async register(createUserDto: CreateUserDto) {
    const { name, username, password, email, phoneNumber } = createUserDto;

    // Check if the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await this.prisma.user.create({
      data: { name, username, email, password: hashedPassword, phoneNumber },
    });

    // Send welcome email
    await this.emailService.sendMail(
      user.email,
      'Welcome to Our Service',
      'Thank you for registering!',
    );

    return user;
  }

  // Find a user by ID
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Fetch all users
  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  // Update user details (excluding addresses)
  async updateUser(updateUserDto: UpdateUserDto) {
    const { id, username, roleId, companyName, contactPerson, phoneNumber, email, description } = updateUserDto;

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
      await this.prisma.seller.delete({ where: { id: updatedUser.id } });
    }

    return updatedUser;
  }

  // Delete a user by ID
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

  // Fetch all sellers excluding those with an admin role
  async getAllSellers() {
    const userDetails = await this.prisma.seller.findMany({
      where: {
        user: {
          role: {
            NOT: { id: 1 }, // Assuming role ID 1 is for Admins
          },
        },
      },
      select: {
        user: true,
      },
    });

    return userDetails.map((seller) => seller.user);
  }

  // Get a seller by ID, excluding those with an admin role
  async getSellerById(id: number) {
    const seller = await this.prisma.seller.findFirst({
      where: {
        id,
        user: {
          role: {
            NOT: { id: 1 }, // Assuming role ID 1 is for Admins
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

  // Update seller details
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

  // Address Management Methods

  // Add a new address to the user's address list
  async addAddress(userId: number, addressDto: AddressDto) {
    const user = await this.findOne(userId);
    const addresses: Address[] = (user.addresses as unknown as Address[]) || [];
    addresses.push(addressDto);

    return this.prisma.user.update({
      where: { id: userId },
      data: { addresses: JSON.stringify(addresses) },
    });
  }

  // Delete an address from the user's address list by identifier
  async deleteAddress(userId: number, identifier: string) {
    const user = await this.findOne(userId);
    const updatedAddresses = (user.addresses as unknown as Address[]).filter(
      (addr) => addr.identifier !== identifier
    );

    return this.prisma.user.update({
      where: { id: userId },
      data: { addresses: JSON.stringify(updatedAddresses) },
    });
  }

  // Retrieve all addresses for a user
  async getAllAddresses(userId: number): Promise<Address[]> {
    const user = await this.findOne(userId);
    return (user.addresses as unknown as Address[]) || [];
  }

  // Retrieve a specific address by identifier
  async getAddressByIdentifier(userId: number, identifier: string): Promise<Address> {
    const user = await this.findOne(userId);
    const address = (user.addresses as unknown as Address[]).find(
      (addr) => addr.identifier === identifier
    );
    if (!address) {
      throw new NotFoundException(`Address with identifier ${identifier} not found`);
    }
    return address;
  }

  // Update an address by identifier
  async updateAddressByIdentifier(userId: number, identifier: string, addressDto: AddressDto) {
    const user = await this.findOne(userId);
    const updatedAddresses = (user.addresses as unknown as Address[]).map((addr) =>
      addr.identifier === identifier ? { ...addr, ...addressDto } : addr
    );

    return this.prisma.user.update({
      where: { id: userId },
      data: { addresses: JSON.stringify(updatedAddresses) },
    });
  }

  // Retrieve the default address for a user
  async getDefaultAddress(userId: number): Promise<Address> {
    const user = await this.findOne(userId);
    const defaultAddress = (user.addresses as unknown as Address[]).find(
      (addr) => addr.default === true
    );
    if (!defaultAddress) {
      throw new NotFoundException('No default address found for this user');
    }
    return defaultAddress;
  }
}

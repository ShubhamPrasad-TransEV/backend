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
import { Address } from '@prisma/client';

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // Register a new user
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

  // Find a user by ID
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Add a new address for a user
  async addAddress(userId: number, addressDto: AddressDto) {
    // If this new address should be the defaultAddress, set others to false
    if (addressDto.defaultAddress) {
      await this.prisma.address.updateMany({
        where: { userId, defaultAddress: true },
        data: { defaultAddress: false },
      });
    }

    // Create and return the new address
    return await this.prisma.address.create({
      data: {
        identifier: addressDto.identifier,
        address: addressDto.address,
        defaultAddress: addressDto.defaultAddress || false,
        userId,
      },
    });
  }

  // Get all addresses for a user
  async getAllAddresses(userId: number): Promise<Address[]> {
    return await this.prisma.address.findMany({
      where: { userId },
    });
  }

  // Get address by identifier
  async getAddressByIdentifier(
    userId: number,
    identifier: string,
  ): Promise<Address> {
    const address = await this.prisma.address.findFirst({
      where: { userId, identifier },
    });

    if (!address) {
      throw new NotFoundException(
        `Address with identifier ${identifier} not found`,
      );
    }

    return address;
  }

  // Update an address by identifier
  async updateAddressByIdentifier(
    userId: number,
    identifier: string,
    addressDto: AddressDto,
  ) {
    const address = await this.prisma.address.findFirst({
      where: { userId, identifier },
    });

    if (!address) {
      throw new NotFoundException(
        `Address with identifier ${identifier} not found`,
      );
    }

    // Ensure only `setDefaultAddress` can set an address as defaultAddress
    const dataToUpdate = {
      ...addressDto,
      defaultAddress: address.defaultAddress,
    };

    return await this.prisma.address.update({
      where: { id: address.id },
      data: dataToUpdate,
    });
  }

  // Set an address as defaultAddress
  async setDefaultAddress(userId: number, identifier: string) {
    // Fetch the address by userId and identifier, not by id
    const address = await this.prisma.address.findFirst({
      where: { userId, identifier },
    });

    // Log the address object to verify it was retrieved correctly

    if (!address) {
      console.error(
        `Address with identifier "${identifier}" not found for user ID ${userId}.`,
      );
      throw new NotFoundException('Address not found');
    }

    // Unset other defaultAddress addresses for the user
    const unsetResult = await this.prisma.address.updateMany({
      where: { userId, defaultAddress: true },
      data: { defaultAddress: false },
    });

    // Set the specified address as defaultAddress
    const updateResult = await this.prisma.address.update({
      where: { id: address.id },
      data: { defaultAddress: true },
    });

    return updateResult;
  }

  // Delete an address by ID
  async deleteAddress(userId: number, addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new NotFoundException(
        'Address not found or does not belong to the user',
      );
    }

    return await this.prisma.address.delete({
      where: { id: addressId },
    });
  }

  // Fetch all users
  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  // Update user details and handle Seller entry based on role
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

  // Fetch all sellers excluding those with an admin role
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

  // Get a seller by ID, excluding those with an admin role
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
}

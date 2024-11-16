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
import * as fs from 'fs';
import * as path from 'path';

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

    // Include profile picture as MIME-prefixed Base64 if it exists
    if (user.ProfilePic) {
      const filePath = path.resolve(user.ProfilePic);
      if (fs.existsSync(filePath)) {
        const mimeType = `image/${path.extname(filePath).slice(1)}`;
        const fileBuffer = fs.readFileSync(filePath);
        user.ProfilePic = `data:${mimeType};base64,${fileBuffer.toString(
          'base64',
        )}`;
      } else {
        user.ProfilePic = null;
      }
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
    const address = await this.prisma.address.findFirst({
      where: { userId, identifier },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.address.updateMany({
      where: { userId, defaultAddress: true },
      data: { defaultAddress: false },
    });

    return await this.prisma.address.update({
      where: { id: address.id },
      data: { defaultAddress: true },
    });
  }

  // Delete an address by ID
  async deleteAddress(userId: number, identifier: string) {
    const address = await this.prisma.address.findUnique({
      where: {
        userId_identifier: {
          userId: userId,
          identifier: identifier,
        },
      },
    });

    if (!address || address.userId !== userId) {
      throw new NotFoundException(
        'Address not found or does not belong to the user',
      );
    }

    return await this.prisma.address.delete({
      where: {
        userId_identifier: {
          userId: userId,
          identifier: identifier,
        },
      },
    });
  }

  // Fetch all users
  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  // Update user details
  async updateUser(updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: updateUserDto.id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: updateUserDto.id },
      data: updateUserDto,
    });
  }

  // Fetch all sellers excluding those with an admin role
  async getAllSellers() {
    const sellers = await this.prisma.seller.findMany({
      where: {
        user: {
          role: {
            NOT: { id: 1 },
          },
        },
      },
      include: { user: true },
    });

    return sellers.map((seller) => seller.user);
  }

  // Save profile picture path to the database
  async saveProfilePicturePath(userId: number, filePath: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { ProfilePic: filePath },
    });

    return { message: 'Profile picture uploaded successfully', filePath };
  }

  // Retrieve profile picture as MIME-type-prefixed Base64
  async getProfilePictureBase64(userId: number): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.ProfilePic) {
      throw new NotFoundException('Profile picture not found');
    }

    const filePath = path.resolve(user.ProfilePic);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Profile picture file not found');
    }

    const mimeType = `image/${path.extname(filePath).slice(1)}`;
    const fileBuffer = fs.readFileSync(filePath);
    return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
  }

  // Fetch seller by ID
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

    return this.prisma.seller.update({
      where: { id },
      data: { aboutUs, logo },
    });
  }

  // Delete user
  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isSeller) {
      await this.prisma.seller.delete({ where: { id } });
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}

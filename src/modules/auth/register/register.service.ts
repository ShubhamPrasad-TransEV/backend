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
    return this.prisma.user.findMany({ include: { role: true } });
  }

  // Update user details and create Seller entry if role is seller
  async updateUser(updateUserDto: UpdateUserDto) {
    const {
      id,
      username,
      roleId,
      companyName,
      contactPerson,
      address,
      phoneNumber,
      email,
      description,
    } = updateUserDto;

    // Ensure id is an integer
    const userId = parseInt(id.toString(), 10);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prepare the update object
    const dataToUpdate: any = {
      username: username ?? undefined,
      email: email ?? undefined, // Ensure email is included and updated if provided
      isSeller: roleId === 3 ? true : undefined,
      companyName: companyName ?? undefined,
      contactPerson: contactPerson ?? undefined,
      address: address ?? undefined,
      phoneNumber: phoneNumber ?? undefined,
      description: description ?? undefined,
    };

    // If `roleId` is provided, update the role using nested relation
    if (roleId) {
      dataToUpdate.role = {
        connect: { id: roleId },
      };
    }

    // Update the user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    // If the user becomes a seller, create a seller entry
    if (roleId === 3 && !user.isSeller) {
      await this.prisma.seller.create({
        data: {
          id: updatedUser.id, // Make the seller's id the same as user's id
        },
      });
    }

    // If the user is no longer a seller, remove the seller entry
    if (user.isSeller && roleId !== 3) {
      await this.prisma.seller.delete({
        where: {
          id: updatedUser.id, // The seller and user share the same id
        },
      });
    }

    return updatedUser;
  }

  // Fetch all sellers
  async getAllSellers() {
    const userDetails = await this.prisma.seller.findMany({
      select: {
        user: true, // Select only the user relation
      },
    });
  
    // Map to return only the user details from each result
    return userDetails.map((seller) => seller.user);
  }

  // Get a seller by ID
  async getSellerById(id: number) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
      include: { user: true }, // Include user info related to seller
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return seller;
  }

  // Delete a user by ID
  async deleteUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete seller if the user is a seller
    if (user.isSeller) {
      await this.prisma.seller.delete({
        where: { id: userId }, // Seller id is the same as user id
      });
    }

    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'User deleted successfully' };
  }

  // Delete a seller by ID
  async deleteSeller(sellerId: number) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // Delete seller entry, user deletion can be handled separately if needed
    await this.prisma.seller.delete({
      where: { id: sellerId },
    });

    return { message: 'Seller deleted successfully' };
  }

  // Update seller details
  async updateSeller(updateSellerDto: UpdateSellerDto) {
    const { id, aboutUs, logo } = updateSellerDto;

    // Check if ID is provided and ensure it's an integer
    if (!id) {
      throw new BadRequestException('Seller ID is required');
    }

    const seller = await this.prisma.seller.findUnique({
      where: { id },
    });
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    const dataToUpdate = {
      aboutUs: aboutUs ?? undefined,
      logo: logo ?? undefined,
    };

    const updatedSeller = await this.prisma.seller.update({
      where: { id },
      data: dataToUpdate,
    });

    return updatedSeller;
  }
}

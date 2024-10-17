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

  // Update user details
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

    return updatedUser;
  }

  // Fetch all sellers
  async getAllSellers() {
    return this.prisma.user.findMany({
      where: { role: { name: 'Seller' } },
      include: { role: true },
    });
  }

  // Get a seller by ID
  async getSellerById(id: number) {
    // Ensure id is an integer
    const sellerId = parseInt(id.toString(), 10);
    const seller = await this.prisma.user.findUnique({
      where: { id: sellerId },
      include: { role: true },
    });

    if (!seller || seller.role.name !== 'Seller') {
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

    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'User deleted successfully' };
  }

  // Delete a seller by ID
  async deleteSeller(sellerId: number) {
    const seller = await this.prisma.user.findUnique({
      where: { id: sellerId },
    });
    if (!seller || !seller.isSeller) {
      throw new NotFoundException('Seller not found');
    }

    await this.prisma.user.delete({ where: { id: sellerId } });
    return { message: 'Seller deleted successfully' };
  }

  // Update seller details
  async updateSeller(updateSellerDto: UpdateSellerDto) {
    const { id, aboutUs, logo } = updateSellerDto;

    // Check if ID is provided and ensure it's an integer
    if (!id) {
      throw new BadRequestException('Seller ID is required');
    }

    const sellerId = parseInt(id.toString(), 10);
    const seller = await this.prisma.user.findUnique({
      where: { id: sellerId },
    });
    if (!seller || !seller.isSeller) {
      throw new NotFoundException('Seller not found');
    }

    const dataToUpdate = {
      aboutUs: aboutUs ?? undefined,
      logo: logo ?? undefined,
    };

    const updatedSeller = await this.prisma.user.update({
      where: { id: sellerId },
      data: dataToUpdate,
    });

    return updatedSeller;
  }
}

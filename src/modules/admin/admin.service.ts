import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { RoleEnum } from '../role/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    const { username, password, role, email, name } = createAdminDto;

    // Check if the username or email already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Validate role
    if (role !== RoleEnum.ADMIN) {
      throw new BadRequestException('Invalid role provided');
    }

    // Find admin role
    const adminRole = await this.prisma.role.findUnique({
      where: { name: RoleEnum.ADMIN },
    });

    if (!adminRole) {
      throw new NotFoundException('Admin role not found');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with admin role
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        name,
        roleId: adminRole.id,
        isSeller: false,
        companyName: createAdminDto.companyName,
        contactPerson: createAdminDto.contactPerson,
        phoneNumber: createAdminDto.phoneNumber,
      },
    });

    // Automatically create an entry in the Admins table
    await this.prisma.admins.create({
      data: {
        adminId: user.id, // Reference the newly created user
      },
    });

    // Automatically create an entry in the Seller table for the admin
    await this.prisma.seller.create({
      data: {
        id: user.id, // Use the same ID as the user ID for the seller
      },
    });

    return user;
  }

  // Method to get an admin by ID
  async getAdminById(id: number) {
    const admin = await this.prisma.admins.findUnique({
      where: { adminId: id },
      include: {
        admin: {
          include: { role: true },
        },
      },
    });

    if (!admin || admin.admin.role?.name !== RoleEnum.ADMIN) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    const result = {
      id: admin.admin.id,
      username: admin.admin.username,
      email: admin.admin.email,
      password: admin.admin.password,
      roleId: admin.admin.roleId,
      isSeller: admin.admin.isSeller,
      name: admin.admin.name,
      phoneNumber: admin.admin.phoneNumber,
      companyName: admin.admin.companyName,
      contactPerson: admin.admin.contactPerson,
      role: {
        id: admin.admin.role.id,
        name: admin.admin.role.name,
      },
    };

    return result;
  }

  // Method to delete an admin by ID
  async deleteAdmin(adminId: number) {
    // Find the admin
    const admin = await this.prisma.admins.findUnique({
      where: { adminId },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }

    // Delete the seller entry associated with the admin
    await this.prisma.seller.delete({
      where: { id: adminId },
    });

    // Delete the admin entry
    await this.prisma.admins.delete({
      where: { adminId },
    });

    // Delete the user entry associated with the admin
    await this.prisma.user.delete({
      where: { id: adminId },
    });

    return { message: 'Admin and associated seller deleted successfully' };
  }
}

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
        isSeller: false, // Admins are not sellers by default
        companyName: createAdminDto.companyName,
        description: createAdminDto.description,
        contactPerson: createAdminDto.contactPerson,
        phoneNumber: createAdminDto.phoneNumber,
        address: createAdminDto.address,
      },
    });

    // Automatically create an entry in the Admins table
    await this.prisma.admins.create({
      data: {
        adminId: user.id, // Reference the newly created user
      },
    });

    return user;
  }

  // Method to get an admin by ID
  async getAdminById(id: number) {
    const admin = await this.prisma.admins.findUnique({
      where: { adminId: id }, // Querying the Admins table using adminId
      include: {
        admin: {
          include: { role: true }, // Including related User and role information
        },
      },
    });
  
    if (!admin || admin.admin.role?.name !== RoleEnum.ADMIN) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
  
    // Transform the result to match the expected response format
    const result = {
      id: admin.admin.id, // Use admin's user id here
      username: admin.admin.username,
      email: admin.admin.email,
      password: admin.admin.password,
      roleId: admin.admin.roleId,
      isSeller: admin.admin.isSeller,
      name: admin.admin.name,
      phoneNumber: admin.admin.phoneNumber,
      companyName: admin.admin.companyName,
      description: admin.admin.description,
      contactPerson: admin.admin.contactPerson,
      address: admin.admin.address,
      role: {
        id: admin.admin.role.id,
        name: admin.admin.role.name,
      },
    };
  
    return result;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { RoleEnum } from '../role/role.enum';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) { }

    async createAdmin(createAdminDto: CreateAdminDto) {
        const { username, password, role } = createAdminDto;

        // Check if the username already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Ensure the role is ADMIN
        if (role !== RoleEnum.ADMIN) {
            throw new Error('Invalid role provided');
        }

        // Find the admin role
        const adminRole = await this.prisma.role.findUnique({
            where: { name: RoleEnum.ADMIN },
        });

        if (!adminRole) {
            throw new Error('Admin role not found');
        }

        // Create the user with admin role
        const user = await this.prisma.user.create({
            data: {
                username,
                password,
                roleId: adminRole.id,
            },
        });

        // Create a Seller record since admins are also sellers
        await this.prisma.seller.create({
            data: {
                userId: user.id,
            },
        });

        return user;
    }
}

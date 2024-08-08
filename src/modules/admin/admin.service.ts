import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { RoleEnum } from '../role/role.enum';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) { }

    async createAdmin(createAdminDto: CreateAdminDto) {
        const { username, password, role, email } = createAdminDto;

        // Check if the username already exists
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            },
        });

        if (existingUser) {
            throw new Error('Username already exists');
        }

        if (role !== RoleEnum.ADMIN) {
            throw new Error('Invalid role provided');
        }

        const adminRole = await this.prisma.role.findUnique({
            where: { name: RoleEnum.ADMIN },
        });

        if (!adminRole) {
            throw new Error('Admin role not found');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user with admin role and seller-specific fields if needed
        const user = await this.prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email,
                roleId: adminRole.id,
                isSeller: true, 
                companyName: createAdminDto.companyName,
                description: createAdminDto.description,
                contactPerson: createAdminDto.contactPerson,
                phoneNumber: createAdminDto.phoneNumber,
                address: createAdminDto.address,
            },
        });

        return user;
    }
}

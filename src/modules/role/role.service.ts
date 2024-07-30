import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleEnum } from './role.enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
    constructor(private readonly prisma: PrismaService) { }

    async createRole(createRoleDto: CreateRoleDto) {
        const { name } = createRoleDto;

        // Check the role names
        if (!Object.values(RoleEnum).includes(name)) {
            throw new Error('Role must be one of the predefined roles (Admin, User, Seller)');
        }

        // Check if the role already exists
        const existingRole = await this.prisma.role.findUnique({
            where: { name: name },             
        });

        if (existingRole) {
            throw new Error('Role already exists, Buddyy!!!');
        }

        // Proceed with new role
        return this.prisma.role.create({
            data: { name },
        });
    }
}

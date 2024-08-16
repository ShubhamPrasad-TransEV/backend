import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from 'src/email/email.service';
import { Console } from 'console';

@Injectable()
export class RegisterService {
    [x: string]: any;
    constructor(private readonly prisma: PrismaService , private readonly emailService: EmailService) { }

    //Register a new user
    async register(createUserDto: CreateUserDto) {
        const { name,username, password, email, phoneNumber } = createUserDto;
        console.log(phoneNumber);
        //Check if the user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            throw new Error('User already exists');
        }
        //Hash the password
        const hashedPassword = await bcrypt.hash(password , 10);
        //Create the user
        const user = await this.prisma.user.create({
            data:{
                name,
                username,
                email,
                password: hashedPassword,
                phoneNumber
            },
        });
        // Send welcome email
    const subject = 'Welcome to Our Application!';
    const text = `Hello ${username}, welcome to our application.`;
    const html = `<strong>Hello ${username}</strong>, welcome to our application.`;

    await this.emailService.sendMail(
        user.email,
        'Welcome to Our Service',
        'Thank you for registering!'
    );
        return user;
    }

    async findOne(id:number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
          }

        return user;
    }

    //Fetch all users
    async getAllUsers() {
        return this.prisma.user.findMany({
            include: {
                role: true, // Include role information
            },
        });
    }
    // Update user details
    async updateUser(updateUserDto: UpdateUserDto) {
        const { id, username, roleId, companyName, description, contactPerson, address } = updateUserDto;

        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const dataToUpdate: any = {
            username: username ?? undefined,
            roleId: roleId ?? undefined,
            isSeller: roleId === 3 ? true : undefined,
            companyName: companyName ?? undefined,
            description: description ?? undefined,
            contactPerson: contactPerson ?? undefined,
            address: address ?? undefined,
        };

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: dataToUpdate,
        });

        return updatedUser;
    }

    async getAllSellers() {
        return this.prisma.user.findMany({
            where: {
                role: {
                    name: 'Seller', // Assuming 'Seller' is the role name in your database
                },
            },
            include: {
                role: true, // Include role information if needed
            },
        });
    }

    async getUsers() {
        return this.prisma.user.findMany({
            where: {
                role: {
                    name: 'User', // Assuming 'Seller' is the role name in your database
                },
            },
            include: {
                role: true, // Include role information if needed
            },
        });
    }


    // Delete a user by ID
    async deleteUser(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.prisma.user.delete({
            where: { id: userId },
        });

        return { message: 'User deleted successfully' };
    }
}

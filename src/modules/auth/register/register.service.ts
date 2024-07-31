import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class RegisterService {
    constructor(private readonly prisma: PrismaService) { }

    //Register a new user
    async register(createUserDto: CreateUserDto) {
        const { username, password } = createUserDto;

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
                username,
                password: hashedPassword,
            },
        });
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
}

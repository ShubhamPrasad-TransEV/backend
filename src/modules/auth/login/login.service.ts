// login.service.ts
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LoginService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { username },
            include: { role: true },
        });

        Logger.log(`Fetchedddddddddd user: ${JSON.stringify(user)}`, 'LoginService');
        
        if (user && await bcrypt.compare(password, user.password)) {
            Logger.log('Password matched', 'LoginService');
            const { password, ...result } = user;
            return result;
        } else {
            Logger.log('Invalid username or password', 'LoginService');
        }

        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user.id, role: user.role.name };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

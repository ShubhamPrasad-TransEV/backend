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
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { role: true, seller: true }, // Include seller in the query
    });

    Logger.log(`Fetched user: ${JSON.stringify(user)}`, 'LoginService');

    if (user && (await bcrypt.compare(password, user.password))) {
      Logger.log('Password matched', 'LoginService');
      const { password, ...result } = user; // Exclude password from the result
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

    // Log the user details for debugging
    Logger.log(`User logged in: ${JSON.stringify(user)}`, 'LoginService');

    // Check if the user has a role and handle the case where it's null
    const roleName = user.role ? user.role.name : 'defaultRole'; // Default to a role if null

    const payload = { username: user.username, sub: user.id, role: roleName };

    // Include sellerId if the user is a seller
    const sellerId = user.seller ? user.seller.id : null;

    Logger.log(`JWT Payload: ${JSON.stringify(payload)}`, 'LoginService');

    return {
      access_token: this.jwtService.sign(payload), // Generate JWT token
      sellerId, // Return sellerId if exists
    };
  }
}
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller()
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    @Post('login')
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'User successfully logged in' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body() loginDto: LoginDto) {
        return this.loginService.login(loginDto);
    }
}

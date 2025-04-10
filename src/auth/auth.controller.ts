import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    // Creates a new user.
    @Post('register')
    async createNewUser(@Body() createUserDto: any) {
        return this.authService.createNewUser(createUserDto);
    }

    // log in an existing user.
    @Post('login')
    async login(@Body() loginDto: any) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    // log out the currently logged-in user.
    @Post('logout')
    async logout(@Request() req) {
        return this.authService.logout(req.user);
    }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

const tokenBlacklist = new Set<string>(); // In-memory token blacklist

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    // Creates a new user in the system.
    async createNewUser(userData: Partial<User>): Promise<{ user: User; message: string }> {
        const { user, message } = await this.usersService.createNewUser(userData); // Destructure user and message
        return { user, message };
    }

    // Authenticates a user and generates a JWT access token
    async login(email: string, password: string): Promise<{ accessToken: string; message: string }> {
        const user = await this.usersService.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const payload = {
            userId: user.id,
            email: user.email,
            name: user.firstName,
            isActive: user.isActive,
            role: user.role
        };
        const accessToken = this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_SECRET') });
        return {
            accessToken,
            message: 'Login successful'
        };
    }

    // Logs out the user.
    async logout(token: string): Promise<{ message: string }> {
        tokenBlacklist.add(token); // Add the token to the blacklist
        return { message: 'Logged out successfully' };
    }

    isTokenBlacklisted(token: string): boolean {
        return tokenBlacklist.has(token); // Check if the token is blacklisted
    }
}


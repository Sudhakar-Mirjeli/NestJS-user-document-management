import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';


@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Use environment variable for the secret key
            signOptions: { expiresIn: '1h' }, // Optional: Set token expiration
        }),
    ],
    providers: [
        AuthService
    ],
    controllers: [AuthController],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}

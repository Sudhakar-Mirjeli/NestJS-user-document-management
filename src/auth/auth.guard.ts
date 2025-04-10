import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector,
        private configService: ConfigService
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers['authorization'];

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Authorization header is missing or invalid.');
        }

        const token = authorizationHeader.split(' ')[1];
        try {
            console.log("rtyuiop process.env.JWT_SECRET", process.env.JWT_SECRET)
            const jwtSecret = this.configService.get<string>('JWT_SECRET');
            if (!jwtSecret) {
                throw new Error('JWT_SECRET is not defined in the configuration.');
            }
            const decoded = jwt.verify(token, jwtSecret); 
           console.log("20 in Auth guard", decoded)
            request.user = decoded; 
        } catch (error) {
            throw new ForbiddenException('Invalid or expired token.');
        }

        return true;
    }
}

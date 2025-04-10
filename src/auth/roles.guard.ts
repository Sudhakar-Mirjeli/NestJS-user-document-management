import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
        if (!requiredRoles) {
            return true; // No roles required, allow access
        }
        const { user } = context.switchToHttp().getRequest();
        console.log('Required Roles:', requiredRoles); // Debug log
        console.log('User Role:', user?.role); // Debug log

        if (!user || !user.role || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Only admin can access this resource.'); // Custom message
        }
        return true;
    }
}

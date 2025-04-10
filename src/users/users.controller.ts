import { Controller, Post, Body, Get, Param, Patch, Query, ForbiddenException, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
@UseGuards(AuthGuard)

export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Create a new user
    @Post('create')
    async createUser(@Body() userData: Partial<User>): Promise<User> {
        try {
            const result = await this.usersService.createNewUser(userData);
            return result.user; // Return only the User object
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }

    // Retrieve all users
    @Get()
    @Roles('admin') //only 'admin' role can access this endpoint
    @UseGuards(RolesGuard)
    findAll() {
        try {
            return this.usersService.fetchAllUsers();
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }

    // Retrieve a specific user by ID
    @Get(':id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    findUserById(@Param('id') id: string) {
        try {
            return this.usersService.findUserById(id);
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }

    // Find a user by email
    @Get('find')
    @Roles('admin')
    @UseGuards(RolesGuard)
    async findUserByEmail(@Query('email') email: string): Promise<User | null> {
        try {
            return await this.usersService.findByEmail(email);

        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }


    // Update a user's details
    @Put(':id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    update(@Param('id') id: string, @Body() updateUserDto: User) {
        try {
            return this.usersService.update(id, updateUserDto);
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }

    // Delete a user by ID
    @Delete(':id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    remove(@Param('id') id: string) {
        try {
            return this.usersService.remove(id);
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }

    // Assign a role to a user
    @Patch('assign-role/:id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    async assignRole(@Param('id') userId: number, @Body('role') role: string): Promise<void> {
        try {
            await this.usersService.assignRole(userId, role);
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }

}
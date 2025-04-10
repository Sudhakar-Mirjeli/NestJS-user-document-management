import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService
  ) { }

  // Register a new user with hashed password
  async createNewUser(userData: Partial<User>): Promise<{ user: User, message: string }> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = this.usersRepository.create({
        ...userData,
        password: hashedPassword,
        role: userData.role
      });
      const savedUser = await this.usersRepository.save(newUser);
      return {
        user: savedUser,
        message: 'User successfully created.'
      };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  //  Retrieve all users from the database.
  async fetchAllUsers(): Promise<User | { message: string } | { data: Array<User> }>{
    try {
      const users= await this.usersRepository.find();
      return { message: 'Users retrived successfully.', data: users };

    } catch (error) {
      throw new Error(`Error retrieving all users: ${error.message}`);
    }
  }

  //  Retrieve a specific user by ID.
  async findUserById(id: string): Promise<User | { message: string }> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: Number(id) } });
      if (!user) {
        return { message: 'User not found with the provided ID.' };
      }
      return user;
    } catch (error) {
      return { message: `Error retrieving user by ID: ${error.message}` };
    }
  }

  // Find a user by their email
  async findByEmail(email: string) {
    try {
      return await this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  // Assign a role to a user, only if the requester is an admin
  async assignRole(userId: number, role: string) {
    try {
      // Update the user's role in the database
      return await this.usersRepository.update(Number(userId), { role });
    } catch (error) {
      throw new Error(`Error assigning role: ${error.message}`);
    }
  }

  // Update a user's details.
  async update(id: string, updateUserDto: Partial<User>): Promise<{ message: string }> {
    try {
      if (updateUserDto.password) {
        updateUserDto['password'] = await bcrypt.hash(updateUserDto.password, 10);
      }
      await this.usersRepository.update(id, updateUserDto);
      return { message: 'User successfully updated.' };
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Remove a user by ID.
  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.usersRepository.delete(id);
      return { message: 'User successfully removed.' };
    } catch (error) {
      throw new Error(`Error removing user: ${error.message}`);
    }
  }
}

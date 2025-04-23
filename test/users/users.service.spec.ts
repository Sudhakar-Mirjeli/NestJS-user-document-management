import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/users/users.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
    let service: UsersService;
    let userRepository: {
        create: jest.Mock;
        save: jest.Mock;
        find: jest.Mock;
        findOne: jest.Mock;
        update: jest.Mock;
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            const config = {
                                JWT_SECRET: 'test-secret',
                                DB_HOST: 'localhost',
                            };
                            return config[key];
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get(getRepositoryToken(User));
    });

    it('should create a new user', async () => {
        const userData = { email: 'sudhakar@example.com', password: 'password123', firstName: 'Sudhakar' };
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const createdUser = { ...userData, id: 1, password: hashedPassword };

        userRepository.create.mockReturnValue(createdUser);
        userRepository.save.mockResolvedValue(createdUser);

        const result = await service.createNewUser(userData);

        expect(result.user).toEqual(createdUser);
        expect(result.message).toBe('User successfully created.');
    });

    it('should fetch all users', async () => {
        const users = [{ id: 1, email: 'test@example.com', firstName: 'Sudhakar' }];
        userRepository.find.mockResolvedValue(users);

        const result = await service.fetchAllUsers();

        expect(result).toEqual({ message: 'Users retrived successfully.', data: users });
    });

    it('should fetch a user by ID', async () => {
        const user = { id: 1, email: 'test@example.com', firstName: 'Sudhakar' };
        userRepository.findOne.mockResolvedValue(user);

        const result = await service.findUserById('1');

        expect(result).toEqual(user);
    });

    it('should update a user', async () => {
        const updateUserDto = { firstName: 'Updated Name' };
        userRepository.update.mockResolvedValue({ affected: 1 });

        const result = await service.update('1', updateUserDto);

        expect(result).toEqual({ message: 'User successfully updated.' });
    });
});

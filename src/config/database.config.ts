import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'newadmin'),
    password: configService.get<string>('DB_PASSWORD', '12345'),
    database: configService.get<string>('DB_NAME', 'postgres'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // Set to false in production
});
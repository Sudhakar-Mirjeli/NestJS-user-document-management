import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './config/database.config';
import { DocumentsController } from './documents/documents.controller';
import { DocumentsService } from './documents/documents.service';
import { DocumentsModule } from './documents/documents.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IngestionModule } from './ingestion/ingestion.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: '.env', // Ensure the .env file is correctly loaded
    // }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     ...databaseConfig(configService), // Ensure databaseConfig uses .env variables
    //     logging: true, // Enable logging for debugging
    //     retryAttempts: 5, // Increase retry attempts
    //     retryDelay: 3000, // Delay between retries (in milliseconds)
    //   }),
    //   inject: [ConfigService],
    // }),
    ConfigModule.forRoot({
      isGlobal: true, // ⬅️ Make sure this is true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    DocumentsModule,
    ConfigModule,
    IngestionModule
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    DocumentsController
  ],
  providers: [
    AppService,
    AuthService,
    UsersService,
    DocumentsService
  ],
})
export class AppModule { }

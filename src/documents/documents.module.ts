import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './documents.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    ConfigModule, 
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [TypeOrmModule], // Export TypeOrmModule for use in other modules
})
export class DocumentsModule {}
 
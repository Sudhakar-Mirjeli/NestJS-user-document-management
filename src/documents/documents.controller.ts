import { Controller, Get, Post, Put, Delete, Param, Body, UploadedFile, UseInterceptors, Request, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { DocumentsService } from './documents.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    // Create a new document with file upload
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    createDocument(@Body() createDocumentDto: any, @UploadedFile() file: Multer.File, @Request() req: any) {
        const userProfile = req.user;
        return this.documentsService.createDocument(createDocumentDto, file, userProfile);
    }

    // Fetch all documents
    @Get()
    getAllDocuments(@Request() req: any) {
        const userProfile = req.user;
        return this.documentsService.getAllDocuments();
    }

    // Fetch a document by its ID
    @Get(':id')
    getDocumentById(@Param('id') id: number, @Request() req: any) {
        const userProfile = req.user;
        return this.documentsService.getDocumentById(id);
    }

    // Update a document by its ID
    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles('admin', 'editor')
    updateDocument(@Param('id') id: number, @Body() updateDocumentDto: any, @Request() req: any) {
        const userProfile = req.user;
        return this.documentsService.updateDocument(id, updateDocumentDto, userProfile);
    }

    // Delete a document by its ID
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    deleteDocument(@Param('id') id: number, @Request() req: any) {
        return this.documentsService.deleteDocument(id);
    }
}

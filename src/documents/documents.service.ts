import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Multer } from 'multer';
import { Document } from './documents.entity';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/users.entity';
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

@Injectable()
export class DocumentsService {

    private s3Client: typeof S3Client;

    constructor(
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,
        private readonly configService: ConfigService, // Inject ConfigService
    ) {
        // Initialize S3 client with dynamic configuration
        this.s3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY'),
                secretAccessKey: this.configService.get<string>('AWS_S3_SECRET_KEY'),
            },
        });
    }

    // Create a new document with metadata and file upload to S3
    async createDocument(createDocumentDto: Partial<Document>, file: Multer.File, loggedInUser: { userId: number }) {
        try {
            console.log("userProfile in creating document", loggedInUser);
            let documentUrl = '';
            if (file) documentUrl = await this.uploadToS3(file);

            const newDocument = this.documentRepository.create({
                ...createDocumentDto,
                documentName: createDocumentDto.documentName,
                fileName: file.originalname,
                fileUrl: documentUrl,
                uploadedBy: { id: loggedInUser.userId }, // Pass only the user ID
            });
            await this.documentRepository.save(newDocument);

            return { message: 'Document created successfully', data: newDocument };
        } catch (error) {
            console.error('Error creating document:', error);
            throw new Error('Failed to create document');
        }
    }

    // Fetch all documents from the database
    async getAllDocuments() {
        try {
            const documents = await this.documentRepository.find();
            return { message: 'Documents retrieved successfully.', data: documents };
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw new Error('Failed to fetch documents');
        }
    }

    // Fetch a document by its ID from the database
    async getDocumentById(id: number) {
        try {
            const document = await this.documentRepository.findOne({
                where: { id: Number(id) },
            });
            if (!document) {
                throw new Error(`Document with ID ${id} not found`);
            }
            return { message: `Fetched document with ID ${id}`, data: document };
        } catch (error) {
            console.error(`Error fetching document with ID ${id}:`, error);
            throw new Error('Failed to fetch document');
        }
    }

    // Update an existing document by its ID
    async updateDocument(id: number, updateDocumentDto: Partial<Document>, loggedInUser: object) {
        try {
            const document = await this.documentRepository.findOne({ where: { id: Number(id) } });
            if (!document) {
                throw new Error(`Document with ID ${id} not found`);
            }
            const updatedDocument = this.documentRepository.merge(document, {
                ...updateDocumentDto,
                documentName: updateDocumentDto.documentName, // Handle documentName
                updatedBy: loggedInUser

            });
            await this.documentRepository.save(updatedDocument);
            return { message: `Document with ID ${id} updated successfully`, data: updatedDocument };
        } catch (error) {
            console.error(`Error updating document with ID ${id}:`, error);
            throw new Error('Failed to update document');
        }
    }

    // Delete a document by its ID
    async deleteDocument(id: number) {
        try {
            const result = await this.documentRepository.delete(id);
            if (result.affected === 0) {
                throw new Error(`Document with ID ${id} not found`);
            }
            return { message: `Document with ID ${id} deleted successfully` };
        } catch (error) {
            console.error(`Error deleting document with ID ${id}:`, error);
            throw new Error('Failed to delete document');
        }
    }

    // Upload file to S3 bucket and return the file URL
    private async uploadToS3(file: Multer.File): Promise<string> {
        try {
            const params = {
                Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
                Key: `${Date.now()}_${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            };

            const command = new PutObjectCommand(params);
            await this.s3Client.send(command);

            // Construct the file URL manually
            const fileUrl = `https://${this.configService.get<string>('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${params.Key}`;
            return fileUrl;
        } catch (error) {
            console.error('Error uploading file to S3:', error);
            throw new Error('Failed to upload file to S3');
        }
    }
}

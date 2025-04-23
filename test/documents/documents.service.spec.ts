import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from '../../src/documents/documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../../src/documents/documents.entity';
import { ConfigService } from '@nestjs/config';

describe('DocumentsService', () => {
    let service: DocumentsService;
    let documentRepository: {
        create: jest.Mock;
        save: jest.Mock;
        find: jest.Mock;
        findOne: jest.Mock;
        merge: jest.Mock;
        delete: jest.Mock;
    };

   beforeEach(async () => {
    jest.clearAllMocks(); // Clear all mocks before each test
    const module: TestingModule = await Test.createTestingModule({
        providers: [
            DocumentsService,
            {
                provide: getRepositoryToken(Document),
                useValue: {
                    create: jest.fn(),
                    save: jest.fn(),
                    find: jest.fn(),
                    findOne: jest.fn(),
                    merge: jest.fn(),
                    delete: jest.fn(),
                },
            },
            {
                provide: ConfigService,
                useValue: {
                    get: jest.fn((key: string) => {
                        const config = {
                            AWS_REGION: 'us-east-1',
                            AWS_S3_ACCESS_KEY: 'test-access-key',
                            AWS_S3_SECRET_KEY: 'test-secret-key',
                            AWS_S3_BUCKET_NAME: 'test-bucket',
                        };
                        return config[key];
                    }),
                },
            },
        ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    documentRepository = module.get(getRepositoryToken(Document));

    // Mock the private method `uploadToS3`
    (service as any).uploadToS3 = jest.fn().mockResolvedValue('https://test-bucket.s3.amazonaws.com/test.pdf');
});

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a document', async () => {
        const createDocumentDto = { documentName: 'Test Document' };
        const file = { originalname: 'test.pdf', buffer: Buffer.from('test'), mimetype: 'application/pdf' } as any;
        const loggedInUser = { userId: 1 };

        documentRepository.create.mockReturnValue({ ...createDocumentDto, id: 1 } as any);
        documentRepository.save.mockResolvedValue({ ...createDocumentDto, id: 1 } as any);

        const result = await service.createDocument(createDocumentDto, file, loggedInUser);

        expect(result).toEqual({
            message: 'Document created successfully',
            data: { ...createDocumentDto, id: 1 },
        });
    });

    it('should create a document with a file', async () => {
        const createDocumentDto = { documentName: 'Test Document' };
        const file = {
            originalname: 'test.pdf',
            buffer: Buffer.from('test content'),
            mimetype: 'application/pdf',
        } as any; // Mock file object
        const loggedInUser = { userId: 1 };

        documentRepository.create.mockReturnValue({ ...createDocumentDto, id: 1, fileName: file.originalname } as any);
        documentRepository.save.mockResolvedValue({ ...createDocumentDto, id: 1, fileName: file.originalname } as any);

        const result = await service.createDocument(createDocumentDto, file, loggedInUser);

        expect(result).toEqual({
            message: 'Document created successfully',
            data: { ...createDocumentDto, id: 1, fileName: file.originalname },
        });
    });

    it('should create a document with a valid file', async () => {
        const createDocumentDto = { documentName: 'Test Document' };
        const file = {
            originalname: 'test.pdf',
            buffer: Buffer.from('test content'),
            mimetype: 'application/pdf',
        } as any; // Mock file object
        const loggedInUser = { userId: 1 };

        documentRepository.create.mockReturnValue({ ...createDocumentDto, id: 1, fileName: file.originalname } as any);
        documentRepository.save.mockResolvedValue({ ...createDocumentDto, id: 1, fileName: file.originalname } as any);

        const result = await service.createDocument(createDocumentDto, file, loggedInUser);

        expect(result).toEqual({
            message: 'Document created successfully',
            data: { ...createDocumentDto, id: 1, fileName: file.originalname },
        });
    });

    it('should fetch all documents', async () => {
        const documents = [{ id: 1, documentName: 'Test Document' }];
        documentRepository.find.mockResolvedValue(documents as any);

        const result = await service.getAllDocuments();

        expect(result).toEqual({
            message: 'Documents retrieved successfully.',
            data: documents,
        });
    });

    it('should fetch a document by ID', async () => {
        const document = { id: 1, documentName: 'Test Document' };
        documentRepository.findOne.mockResolvedValue(document as any);

        const result = await service.getDocumentById(1);

        expect(result).toEqual({
            message: `Fetched document with ID 1`,
            data: document,
        });
    });

    it('should update a document', async () => {
        const document = { id: 1, documentName: 'Old Name' };
        const updateDocumentDto = { documentName: 'Updated Name' };
        documentRepository.findOne.mockResolvedValue(document as any);
        documentRepository.merge.mockReturnValue({ ...document, ...updateDocumentDto } as any);
        documentRepository.save.mockResolvedValue({ ...document, ...updateDocumentDto } as any);

        const result = await service.updateDocument(1, updateDocumentDto, { userId: 1 });

        expect(result).toEqual({
            message: `Document with ID 1 updated successfully`,
            data: { ...document, ...updateDocumentDto },
        });
    });

    it('should delete a document', async () => {
        documentRepository.delete.mockResolvedValue({ affected: 1 } as any);

        const result = await service.deleteDocument(1);

        expect(result).toEqual({
            message: `Document with ID 1 deleted successfully`,
        });
    });
});

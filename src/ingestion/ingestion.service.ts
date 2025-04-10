import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IngestionService {
  constructor(private httpService: HttpService) {}

  // Triggers the ingestion process for a given document ID
  async triggerIngestion(documentId: string) {
    const payload = { documentId };
    try {
      const response = await firstValueFrom(this.httpService.post('http://python-backend/ingest/start', payload));
      return { message: 'Ingestion triggered successfully', data: response.data };
    } catch (err) {
      return { error: 'Failed to trigger ingestion', details: err.message };
    }
  }

  // Retrieves the ingestion status for a given ID
  async getIngestionStatus(id: string) {
    try {
      const response = await firstValueFrom(this.httpService.get(`http://python-backend/ingest/status/${id}`));
      return { message: 'Ingestion status retrieved successfully', data: response.data };
    } catch (err) {
      return { error: 'Failed to get status', details: err.message };
    }
  }

  // Fetches the ingestion history
  async getIngestionHistory() {
    try {
      const response = await firstValueFrom(this.httpService.get('http://python-backend/ingest/history'));
      return { message: 'Ingestion history retrieved successfully', data: response.data };
    } catch (err) {
      return { error: 'Failed to get history', details: err.message };
    }
  }
}

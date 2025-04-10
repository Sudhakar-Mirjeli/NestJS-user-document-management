import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('ingestion')
@UseGuards(AuthGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  // Triggers the ingestion process for a given document ID
  @Post('trigger')
  triggerIngestion(@Body() body: { documentId: string }) {
    return this.ingestionService.triggerIngestion(body.documentId);
  }

  // Retrieves the ingestion status for a specific ID
  @Get('status/:id')
  getIngestionStatus(@Param('id') id: string) {
    return this.ingestionService.getIngestionStatus(id);
  }

  // Fetches the ingestion history
  @Get('history')
  getIngestionHistory() {
    return this.ingestionService.getIngestionHistory();
  }
}


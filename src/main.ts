import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService); // Get ConfigService instance

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Swagger based doc on User-Document-Management APIs')
    .setVersion('1.0')
    .addTag('User-Document-Management')
    .addBearerAuth() // 👈 This is important 
    .build();  

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<string>('PORT') || 3000; // Use ConfigService to get PORT
  console.log(`Application is starting on port: ${port}`); // Log the port for debugging
  await app.listen(port);
}
bootstrap();

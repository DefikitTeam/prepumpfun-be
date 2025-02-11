// Import this first!
import './instrument';

// Now import other modules
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { config } from './config';
import { LogLevel, ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter, HttpErrorFilter, HttpExceptionFilter } from './common/filters';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: config.LOG_LEVEL as LogLevel[],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new HttpErrorFilter());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'swagger.json'), 'utf8'));
  SwaggerModule.setup('doc', app, swaggerDocument);

  await app.listen(config.PORT);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { EventModule } from './modules/event.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(EventModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
}
bootstrap();
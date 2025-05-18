import { NestFactory } from '@nestjs/core';
import { AuthModule } from './modules/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  console.log('Mongo URI:', process.env.MONGO_URI);
}
bootstrap();

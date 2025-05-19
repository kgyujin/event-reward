import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './modules/gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();

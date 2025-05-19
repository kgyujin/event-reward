import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { GatewayService } from './services/gateway.service';
import { HealthController } from './controllers/health.controller';

@Module({
  providers: [GatewayService],
  controllers: [HealthController],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GatewayService).forRoutes('*');
  }
}
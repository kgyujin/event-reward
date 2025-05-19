import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventController } from '../controllers/event.controller';
import { RewardController } from '../controllers/reward.controller';
import { RewardRequestController } from '../controllers/reward-request.controller';
import { Event, EventSchema } from '../schemas/event.schema';
import { Reward, RewardSchema } from '../schemas/reward.schema';
import { RewardRequest, RewardRequestSchema } from '../schemas/reward-request.schema';
import { EventService } from '../services/event.service';
import { RewardService } from '../services/reward.service';
import { RewardRequestService } from '../services/reward-request.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
  ],
  controllers: [EventController, RewardController, RewardRequestController],
  providers: [EventService, RewardService, RewardRequestService],
})
export class EventModule {}
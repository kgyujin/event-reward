import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from '../schemas/reward.schema';
import { RewardService } from '../services/reward.service';
import { RewardController } from '../controllers/reward.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }])],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
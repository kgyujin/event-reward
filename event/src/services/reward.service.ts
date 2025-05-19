import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward, RewardDocument } from '../schemas/reward.schema';
import { Model } from 'mongoose';
import { CreateRewardDto } from '../dto/create-reward.dto';

@Injectable()
export class RewardService {
  constructor(@InjectModel(Reward.name) private rewardModel: Model<RewardDocument>) {}

  async createReward(dto: CreateRewardDto) {
    return this.rewardModel.create(dto);
  }

  async findByEventId(eventId: string) {
    return this.rewardModel.find({ eventId });
  }

  async findAll() {
    return this.rewardModel.find();
  }
}
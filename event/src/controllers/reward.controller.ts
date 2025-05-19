import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RewardService } from '../services/reward.service';
import { CreateRewardDto } from '../dto/create-reward.dto';

@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  create(@Body() dto: CreateRewardDto) {
    return this.rewardService.createReward(dto);
  }

  @Get('event/:eventId')
  getByEvent(@Param('eventId') eventId: string) {
    return this.rewardService.findByEventId(eventId);
  }

  @Get()
  getAll() {
    return this.rewardService.findAll();
  }
}
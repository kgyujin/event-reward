import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { RewardRequestService } from '../services/reward-request.service';
import { CreateRewardRequestDto } from '../dto/create-reward-request.dto';
import { UpdateRewardRequestStatusDto } from '../dto/update-reward-request-status.dto';

@Controller('reward-requests')
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @Post()
  create(@Body() dto: CreateRewardRequestDto) {
    return this.rewardRequestService.create(dto);
  }

  @Get()
  findAll() {
    return this.rewardRequestService.findAll();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRewardRequestStatusDto,
  ) {
    return this.rewardRequestService.updateStatus(id, dto.status);
  }
}
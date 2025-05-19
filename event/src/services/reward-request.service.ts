import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RewardRequest, RewardRequestDocument } from '../schemas/reward-request.schema';
import { CreateRewardRequestDto } from '../dto/create-reward-request.dto';

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name) private rewardRequestModel: Model<RewardRequestDocument>,
  ) {}

  async create(dto: CreateRewardRequestDto) {
    return this.rewardRequestModel.create({
      ...dto,
      userId: new Types.ObjectId(dto.userId),
      eventId: new Types.ObjectId(dto.eventId),
      rewardId: new Types.ObjectId(dto.rewardId),
      status: 'PENDING',
    });
  }

  async findAll() {
    return this.rewardRequestModel
      .find()
      .populate('userId')
      .populate('eventId')
      .populate('rewardId');
  }

  async updateStatus(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
    const existing = await this.rewardRequestModel.findById(id);
    if (!existing) throw new NotFoundException('보상 요청을 찾을 수 없습니다.');
    if (existing.status === 'APPROVED') throw new ConflictException('이미 승인된 요청입니다.');

    const updateData: any = { status };
    if (status === 'APPROVED') updateData.grantedAt = new Date();

    return this.rewardRequestModel.findByIdAndUpdate(id, updateData, { new: true });
  }
}
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RewardRequest, RewardRequestDocument } from '../schemas/reward-request.schema';
import { CreateRewardRequestDto } from '../dto/create-reward-request.dto';
import { Event, EventDocument } from '../schemas/event.schema';

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name) private rewardRequestModel: Model<RewardRequestDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(dto: CreateRewardRequestDto & { userLevel?: number; userMonsterKillCount?: number }) {
    const exists = await this.rewardRequestModel.findOne({
      userId: dto.userId,
      eventId: dto.eventId,
      rewardId: dto.rewardId,
    });
    if (exists) throw new ConflictException('이미 보상 요청이 존재합니다.');

    const event = await this.eventModel.findById(dto.eventId);
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    if (dto.userLevel !== undefined && dto.userLevel < event.minLevel) {
      throw new ConflictException('이벤트 최소 레벨 조건을 만족하지 않습니다.');
    }
    if (dto.userMonsterKillCount !== undefined && dto.userMonsterKillCount < event.monsterKillCount) {
      throw new ConflictException('이벤트 몬스터 처치 조건을 만족하지 않습니다.');
    }

    return this.rewardRequestModel.create({
      ...dto,
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
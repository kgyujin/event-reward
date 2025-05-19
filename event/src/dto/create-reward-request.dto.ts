import { IsString, IsOptional } from 'class-validator';

export class CreateRewardRequestDto {
  @IsString()
  userId: string;

  @IsString()
  eventId: string;

  @IsString()
  rewardId: string;

  @IsOptional()
  @IsString()
  message?: string;
}
import { IsString, IsIn } from 'class-validator';

export class UpdateRewardRequestStatusDto {
  @IsString()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
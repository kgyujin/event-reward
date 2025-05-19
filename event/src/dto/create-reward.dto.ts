import { IsString, IsInt, IsBoolean } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  name: string;

  @IsInt()
  point: number;

  @IsString()
  eventId: string;

  @IsBoolean()
  isUnique: boolean;
}
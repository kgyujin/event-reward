import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../user/user.schema';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  role?: UserRole;
}
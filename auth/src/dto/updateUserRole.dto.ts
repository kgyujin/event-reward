import { IsString, IsIn } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class UpdateUserRoleDto {
  @IsString()
  @IsIn(['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'])
  role: UserRole;
}
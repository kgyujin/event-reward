import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/createUser.dto';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role } = createUserDto;

    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const hashed = await bcrypt.hash(password, 10);
    const created = new this.userModel({ email, password: hashed, role });
    return created.save();
  }
}
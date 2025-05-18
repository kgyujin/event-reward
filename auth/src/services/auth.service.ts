import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/createUser.dto';
import { LoginUserDto } from '../dto/loginUser.dto';
import { User as UserModel, UserDocument } from '../schemas/user.schema';
import { LogService } from '../log/log.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly logService: LogService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<UserModel> {
    const { email, password, role } = createUserDto;

    const existing = await this.userModel.findOne({ email });
    if (existing) {
      await this.logService.createLog({
        type: 'SIGNUP',
        email,
        status: 'FAIL',
        message: '이미 존재하는 이메일',
      });
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const hashed = await bcrypt.hash(password, 10);
    const created = new this.userModel({ email, password: hashed, role }) as UserDocument;
    const result = await created.save();

    await this.logService.createLog({
      type: 'SIGNUP',
      email,
      userId: created.id,
      status: 'SUCCESS',
    });

    return result;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email }) as UserDocument | null;
    if (!user) {
      await this.logService.createLog({
        type: 'LOGIN',
        email,
        status: 'FAIL',
        message: '존재하지 않는 이메일',
      });
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.logService.createLog({
        type: 'LOGIN',
        email,
        userId: user.id,
        status: 'FAIL',
        message: '비밀번호 불일치',
      });
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    await this.logService.createLog({
      type: 'LOGIN',
      email,
      userId: user.id,
      status: 'SUCCESS',
    });

    return { accessToken };
  }
}
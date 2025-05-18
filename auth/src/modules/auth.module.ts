import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserModule } from './user.module';
import { User, UserSchema } from '../schemas/user.schema';
import { LogModule } from '../log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET as string,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN as string },
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    UserModule,
    LogModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
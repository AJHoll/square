import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import * as process from 'process';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.AUTH_SECRET_KEY,
      signOptions: { expiresIn: process.env.AUTH_EXPIRES_IN },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {
}

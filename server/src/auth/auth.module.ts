import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './auth.strategy';

@Module({
  imports: [PassportModule],
  providers: [GoogleStrategy],
})
export class AuthModule {}

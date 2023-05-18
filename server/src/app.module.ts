// import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  // imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, JwtService, GoogleStrategy, JwtStrategy],
})
export class AppModule { }

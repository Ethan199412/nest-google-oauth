import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth-test/auth.controller';
import { AuthModule } from './auth-test/auth.module';

@Module({
  // imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

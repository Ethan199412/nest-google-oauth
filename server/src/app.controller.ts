import { BadRequestException, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express'
import axios from 'axios';
import { AuthGuard } from './auth/auth.guard';
import { prisma } from './mysql-client';
import { clientID, clientSecret } from './const';
import { AuthMiddleware } from './auth/auth.middleware';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('data')
  @UseGuards(AuthGuard)
  getDataByEmail(@Req() req: Request) {
    return 'success'
  }
}

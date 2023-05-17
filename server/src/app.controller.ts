import { BadRequestException, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express'
import axios from 'axios';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('data')
  @UseGuards(AuthGuard)
  getDataByEmail(@Req() req: Request){
    
    return 'success' 
  }

  @Get('token')
  async getToken(@Req() req: Request, @Res() resp: Response) {
    console.log('[p0.1] req', req.query)
    const { code } = req.query
    if (!code) {
      throw new BadRequestException('no code provided')
    }
    const clientId = '581133854653-l9sas35o3vf5kn1qttkvko7d7lqtbcbb.apps.googleusercontent.com'
    const clientSecret = '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'

    // const endpoint = 'https://oauth2.googleapis.com/token'
    const endpoint = 'https://accounts.google.com/o/oauth2/token'
    const res = await axios.post(endpoint, {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: 'http://localhost:3005/login',
      grant_type: 'authorization_code',
      // grant_type: 'refresh_token'
      access_type: 'offline'
    })

    // const res2 = await axios.post('https://www.googleapis.com/oauth2/v4/token',{

    // })

    console.log('[p0.2] res', res.data)
    const { access_token, expires_in } = res.data
    
    resp.cookie('access_token', access_token, {
      maxAge: expires_in * 1000,
      domain: 'localhost',
      httpOnly: false,
      sameSite: 'none',
      secure: true
      // path: '/login'
    })

    // resp.header('Access-Control-Allow-Origin', 'lo');
    resp.header('Access-Control-Allow-Credentials', 'true');

    resp.send(res.data)
  }
}

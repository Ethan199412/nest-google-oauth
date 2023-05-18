import { BadRequestException, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express'
import axios from 'axios';
import { AuthGuard } from './auth/auth.guard';
import { prisma } from './mysql-client';
import { clientID, clientSecret } from './const';


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

  @Get('check')
  async exchangeToken(@Req() req: Request, @Res() resp: Response) {
    const { access_token } = req.cookies
    const record = await prisma.auth_test_table.findFirst({
      where: {
        access_token
      }
    })

    console.log('[p0.5] record', { record, access_token })
    // const res = await axios.post('https://oauth2.googleapis.com/token', {
    //   client_id: clientID,
    //   client_secret: clientSecret,
    //   grant_type: 'refresh_token',
    //   refresh_token: '1//0gDFJt3JhlM5ACgYIARAAGBASNwF-L9Irdu0F7wDXTcm1WKHmwmoeDStwl_91qK2EyKG_m9MldDUzhovPS0PNwWrPnn0N1KHOPuA'
    // })
    // console.log('[p0.5] res', res)
    // return res.data
  }

  @Get('token')
  async getToken(@Req() req: Request, @Res() resp: Response) {
    console.log('[p0.1] req', req.query)
    const { code } = req.query
    if (!code) {
      throw new BadRequestException('no code provided')
    }

    const res: any = await this.appService.getTokenFromCode(code as string)

    // const res2 = await axios.post('https://www.googleapis.com/oauth2/v4/token',{

    // })

    console.log('[p0.2] res', res.data)
    const { access_token, expires_in, refresh_token } = res.data

    resp.cookie('access_token', access_token, {
      maxAge: expires_in * 1000,
      domain: 'localhost',
      httpOnly: false,
      sameSite: 'none',
      secure: true
      // path: '/login'
    })

    const res2: any = await this.appService.getUserInfoFromToken(access_token)
    console.log('[p0.3] res2', res2.data)

    const { email } = res2.data

    if (access_token && refresh_token && email) {
      const record = await prisma.auth_test_table.findUnique({
        where: {
          email
        }
      })
      // 没有则新增
      if (!record) {
        const addRecord = await prisma.auth_test_table.create({
          data: {
            email,
            access_token,
            refresh_token
          },
        })
        console.log('[p0.4]', { record, addRecord })
      }
      // 有则更新
      else {
        const updateRecord = await prisma.auth_test_table.update({
          where: {
            email
          },
          data: {
            email,
            access_token,
            refresh_token
          }
        })
        console.log('[p0.4]', { record, updateRecord })
      }
    }

    if (access_token && email) {
      const updateRecord = await prisma.auth_test_table.update({
        where: {
          email
        },
        data: {
          email,
          access_token,
        }
      })
      console.log('[p0.41]', { updateRecord })
    }

    resp.header('Access-Control-Allow-Credentials', 'true');

    resp.send({ ...res.data, ...res2.data })
  }
}

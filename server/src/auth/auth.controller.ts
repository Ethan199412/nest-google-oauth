import { BadRequestException, Controller, Get, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from 'express'
import { prisma } from "src/mysql-client";
import axios from "axios";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {

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

        // 用 code 置换 token
        const res: any = await this.authService.getTokenFromCode(code as string)

        console.log('[p0.2] res', res.data)
        const { access_token, expires_in, refresh_token } = res.data

        resp.cookie('access_token', access_token, {
            maxAge: 3600 * 24 * 30 * 1000, // 30d
            domain: 'localhost',
            httpOnly: false,
            sameSite: 'none',
            secure: true
            // path: '/login'
        })

        // 用 token 拿用户信息
        const res2: any = await this.authService.getUserInfoFromToken(access_token)
        console.log('[p0.3] res2', res2.data)

        const { email } = res2.data

        // 更新数据库
        await this.authService.createOrUpdateToken({ email, access_token, refresh_token })

        resp.header('Access-Control-Allow-Credentials', 'true');
        resp.send({ ...res.data, ...res2.data })
    }
}
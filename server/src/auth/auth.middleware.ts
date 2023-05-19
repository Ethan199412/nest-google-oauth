import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { clientID, clientSecret } from 'src/const';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly authService: AuthService) {

    }
    async use(req: Request, res: Response, next: NextFunction) {
        const access_token = req.cookies['access_token'];
        console.log('[p4.1] access_token', access_token)
        if (!access_token) {
            //   return next();
            throw new UnauthorizedException('no valid token')
        }
        // 如果有 token 要看过没过期
        const userInfo: any = await this.authService.getUserInfoFromToken(access_token).catch(async e => {
            // 如果是过期了

            // 先拿 refresh_token
            const refresh_token = await this.authService.getRefreshTokenByAccessToken(access_token)
            console.log('[p4.2]', { refresh_token })

            // 换新的 access_token
            const newInfo = await axios.post('https://oauth2.googleapis.com/token', {
                client_id: clientID,
                client_secret: clientSecret,
                grant_type: 'refresh_token',
                refresh_token
            }).catch(e => {
                throw new UnauthorizedException('invalid or expired access token')
            })

            console.log('[p4.0]', { newInfo: newInfo.data })
            const { access_token: new_access_token } = newInfo.data

            // 更新数据库保证一致性
            await this.authService.updateRecordByAccessToken({ access_token: new_access_token }, access_token)

            // 重置 cookie
            res.cookie('access_token', new_access_token, {
                maxAge: 3600 * 24 * 30 * 1000, // 30d
                domain: 'localhost',
                httpOnly: false,
                sameSite: 'none',
                secure: true
            })
            next()
            return
        })
        // console.log('[p4.5]', { userInfo: userInfo.data })
        next()
        return
    }
}
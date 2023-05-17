import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express'
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(
        context: ExecutionContext,
    ) {
        const request: Request = context.switchToHttp().getRequest();
        const canAccess = await this.validateRequest(request);
        console.log('[p0.6] res', canAccess)
        return canAccess
    }

    validateRequest = async (request: Request) => {
        console.log('[p0.4] cookie', request.headers.cookie, request.cookies)
        const { access_token } = request.cookies
        const res: any = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`).catch(e=>{
            console.log('[p0.41] e', e.response.status)
            const {status} = e.response
            if(status == 401){
                throw new UnauthorizedException('token not valid')
            }
        })
        console.log('[p0.3] res', res.data)
        const { email } = res.data
        if (email) {
            request.query.currentUserEmail = email
            const emailList = ['lijiahao@shopee.com', 'test@shopee.com']
            if (emailList.includes(email)) {
                return true
            }
        }
        return false
    }
}
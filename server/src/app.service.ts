import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

const clientId = '581133854653-l9sas35o3vf5kn1qttkvko7d7lqtbcbb.apps.googleusercontent.com'
const clientSecret = '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'

// const endpoint = 'https://oauth2.googleapis.com/token'
const endpoint = 'https://accounts.google.com/o/oauth2/token'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getTokenFromCode(code: string): Promise<Response> {
    return await axios.post(endpoint, {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: 'http://localhost:3005/login',
      grant_type: 'authorization_code',
      // grant_type: 'refresh_token'
      access_type: 'offline'
    })
  }

  async getUserInfoFromToken(access_token: string): Promise<Response> {
    return await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`)
  }
}

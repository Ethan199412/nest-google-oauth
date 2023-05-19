import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';
import { prisma } from './mysql-client';
import { clientID, clientSecret, redirectUrl } from './const'

// const endpoint = 'https://oauth2.googleapis.com/token'
const endpoint = 'https://accounts.google.com/o/oauth2/token'

interface TokenRecord {
  email: string,
  access_token: string,
  refresh_token?: string
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getTokenFromCode(code: string): Promise<Response> {
    return await axios.post(endpoint, {
      code,
      client_id: clientID,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
      grant_type: 'authorization_code',
      // grant_type: 'refresh_token'
      access_type: 'offline'
    })
  }

  async getUserInfoFromToken(access_token: string): Promise<Response> {
    return await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`)
  }

  async findRecordByEmail(email: string): Promise<any> {
    return await prisma.auth_test_table.findUnique({
      where: {
        email
      }
    })
  }

  async createNewRecord(data: any): Promise<any> {
    return prisma.auth_test_table.create({
      data
    })
  }

  async updateRecordByEmail(data: any, email: string) {
    return prisma.auth_test_table.update({
      where: {
        email
      },
      data
    })
  }

  async createOrUpdateToken(data: TokenRecord) {
    const { email, access_token, refresh_token } = data
    if (access_token && refresh_token && email) {
      const record = await this.findRecordByEmail(email)
      // 没有则新增
      if (!record) {
        const addRecord = await this.createNewRecord({
          email,
          access_token,
          refresh_token
        })
        console.log('[p0.4]', { record, addRecord })
      }
      // 有则更新
      else {
        const updateRecord = await this.updateRecordByEmail({
          email,
          access_token,
          refresh_token
        }, email)

        console.log('[p0.4]', { record, updateRecord })
      }
    }

    if (access_token && email) {
      const updateRecord = await this.updateRecordByEmail({
        email,
        access_token,
      }, email)

      console.log('[p0.41]', { updateRecord })
    }
  }
}

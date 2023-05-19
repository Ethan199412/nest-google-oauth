import { Injectable } from "@nestjs/common";
import axios from "axios";
import { clientID, clientSecret, redirectUrl } from "src/const";
import { prisma } from "src/mysql-client";

const endpoint = 'https://accounts.google.com/o/oauth2/token'

interface TokenRecord {
    email: string,
    access_token: string,
    refresh_token?: string
}

@Injectable()
export class AuthService {
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
        return await prisma.auth_test_table.create({
            data
        })
    }

    async updateRecordByEmail(data: any, email: string) {
        return await prisma.auth_test_table.update({
            where: {
                email
            },
            data
        })
    }

    async updateRecordByAccessToken(data: any, access_token: string) {
        return await prisma.auth_test_table.updateMany({
            where: {
                access_token
            },
            data
        })
    }

    async getRefreshTokenByAccessToken(access_token: string) {
        const record: any = await prisma.auth_test_table.findFirst({
            where: {
                access_token
            }
        })
        console.log('[p4.3] record', record)
        if (record) {
            const { refresh_token } = record
            return refresh_token
        }
        return null
    }

    async createOrUpdateToken(data: TokenRecord) {
        const { email, access_token, refresh_token } = data
        if (access_token && refresh_token && email) {
            return await prisma.auth_test_table.upsert({
                where: {
                    email
                },
                update: data,
                create: data as any
            })
        }

        // 说明不是第一次，那么一定有 refresh_token 了
        if (access_token && email) {
            const updateRecord = await this.updateRecordByEmail({
                email,
                access_token,
            }, email)

            console.log('[p0.41]', { updateRecord })
        }
    }

    async upsertToken(data: TokenRecord) {
        const { email, access_token, refresh_token } = data
        if (email && access_token && refresh_token) {
            return await prisma.auth_test_table.upsert({
                where: {
                    email
                },
                update: data,
                create: data as any
            })
        }
    }
}
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    // @InjectRepository(User) private userRepository: Repository<User>,
  ) {

  }

  generateJwt(payload){
    return this.jwtService.sign(payload);
  }


  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.findUserByEmail(user.email);

    if (!userExists) {
      return this.registerUser(user);
    }

    return this.generateJwt({
      sub: userExists.id,
      email: userExists.email,
    });
  }

  async registerUser(user: any) {
    try {
      // const newUser = this.userRepository.create(user);
      // newUser.username = generateFromEmail(user.email, 5);

      // await this.userRepository.save(newUser);

      // return this.generateJwt({
      //   sub: newUser.id,
      //   email: newUser.email,
      // });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email) {
    return {} as any
    // const user = await this.userRepository.findOne({ email });

    // if (!user) {
    //   return null;
    // }

    // return user;
  }



  getHello(): string {
    return 'Hello World!';
  }
}

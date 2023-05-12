import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: '581133854653-l9sas35o3vf5kn1qttkvko7d7lqtbcbb.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3006/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      accessToken,
      refreshToken,
      profile,
    };
  }
}

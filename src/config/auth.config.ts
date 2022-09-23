import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { IAuthModuleOptions } from '@nestjs/passport';

export const jwtModuleAsyncConfig: JwtModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('auth.jwtAccessTokenSecret'),
    signOptions: { expiresIn: '1h' },
  }),
  inject: [ConfigService],
};

export const passportModuleConfig: IAuthModuleOptions = {
  defaultStrategy: 'jwt',
  property: 'user',
  session: false,
};

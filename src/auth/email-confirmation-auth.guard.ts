import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { NO_VERIFIED_EMAIL_KEY } from './no-verified-email.decorator';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiresVerifiedEmail = !this.reflector.getAllAndOverride<boolean>(
      NO_VERIFIED_EMAIL_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic || !requiresVerifiedEmail) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<Request>();
    if (!user?.emailVerified) {
      throw new UnauthorizedException('Confirm your email first');
    }

    return true;
  }
}

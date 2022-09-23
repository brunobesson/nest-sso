import { SetMetadata } from '@nestjs/common';

export const NO_VERIFIED_EMAIL_KEY = 'noVerifiedEmail';
export const NoVerifiedEmail = () => SetMetadata(NO_VERIFIED_EMAIL_KEY, true);

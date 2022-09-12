import { User as U } from '../../src/users/user.entity';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User
      extends Omit<U, 'password' | 'hashPassword' | 'validatePassword'> {}
  }
}

import { AuthGuard } from '@nestjs/passport';

export class ResetPasswordGuard extends AuthGuard('resetPassword') {
  constructor() {
    super();
  }
}

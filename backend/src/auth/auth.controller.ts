import { Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('login')
  async login(@Request() req: { body: UserDto }): Promise<{ access_token: string }> {
    return this.authService.login(req.body);
  }
}

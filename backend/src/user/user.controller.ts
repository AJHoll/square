import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserDto } from '../dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getUserInfo(@Request() req): Promise<UserDto> {
    return { ...(await this.userService.findOne(req.user.username)), password: undefined };
  }
}

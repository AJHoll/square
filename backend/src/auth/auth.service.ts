import {Injectable} from '@nestjs/common';
import {UserService} from '../user/user.service';
import {JwtService} from '@nestjs/jwt';
import {UserDto} from '../dtos/user.dto';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
              private jwtService: JwtService) {
  }

  async validate(username: string, password: string): Promise<UserDto> {
    const user: UserDto = await this.userService.findOne(username);
    const match = await bcrypt.compare(password, (user?.password ?? ''));
    if (match) {
      user.password = undefined;
      return user;
    }
    return null;
  }

  async login(user: UserDto): Promise<{ access_token: string }> {
    const validUser = await this.validate(user.username, user.password);
    if (validUser) {
      return {access_token: this.jwtService.sign(validUser)}
    }
    return {access_token: null}
  }
}

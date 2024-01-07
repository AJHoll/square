import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MainMenuItemDto } from '../dtos/main-menu-item.dto';
import { UserDto } from '../dtos/user.dto';

@Controller('main-menu')
export class MainMenuController {
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMainMenu(@Request() { user }: { user: UserDto }): Promise<MainMenuItemDto[]> { //TODO Начать отсюда (делал получение пунктов меню под конкретного пользователя)
    return [];
  }
}
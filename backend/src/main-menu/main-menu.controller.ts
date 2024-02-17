import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {UserDto} from '../dtos/user.dto';
import {MainMenuService} from './main-menu.service';
import {MainMenuGroupDto} from '../dtos/main-menu-group.dto';

@Controller('main-menu')
export class MainMenuController {
    constructor(private mainMenuService: MainMenuService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getMainMenu(@Request() {user}: { user: UserDto }): Promise<MainMenuGroupDto[]> {
        return this.mainMenuService.getMainMenuByUser(user);
    }
}
import {Injectable} from '@nestjs/common';
import {UserDto} from '../dtos/user.dto';
import {MainMenuGroupDto} from '../dtos/main-menu-group.dto';
import {DatabaseService} from '../services/database.service';
import {MainMenuItemDto} from '../dtos/main-menu-item.dto';

@Injectable()
export class MainMenuService {
    constructor(private databaseService: DatabaseService) {
    }

    async getMainMenuByUser(user: UserDto): Promise<MainMenuGroupDto[]> {
        const dbMenuResult = await this.databaseService.krn_menu_item.findMany(
            {
                include: {krn_menu_group: true},
                where: {adm_role_menu_item: {some: {adm_role: {adm_group_role: {some: {adm_group: {adm_user_group: {some: {user_id: user.id}}}}}}}}},
                orderBy: {id: 'asc'}
            },
        )
        let formattedMainMenu: MainMenuGroupDto[] = [];
        for (const dbResultMenuItem of dbMenuResult) {
            const formattedMenuItem: MainMenuItemDto = {
                id: dbResultMenuItem.id.toNumber(),
                icon: dbResultMenuItem.icon,
                url: dbResultMenuItem.url,
                title: dbResultMenuItem.title,
            }
            const formattedGroup = formattedMainMenu.find(formattedMenuGroup => formattedMenuGroup.id === dbResultMenuItem.krn_menu_group.id.toNumber())
            if (formattedGroup) {
                formattedGroup.items = [...formattedGroup.items, formattedMenuItem];
            } else {
                formattedMainMenu = [...formattedMainMenu, {
                    id: dbResultMenuItem.krn_menu_group.id.toNumber(),
                    icon: dbResultMenuItem.krn_menu_group.icon,
                    title: dbResultMenuItem.krn_menu_group.title,
                    order: 1,
                    items: [formattedMenuItem],
                }]
            }
        }
        return formattedMainMenu;
    }
}
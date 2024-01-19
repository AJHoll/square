import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserDto } from '../dtos/user.dto';
import { KrnMenuService } from './krn-menu.service';
import { KrnMenuItemDto } from '../dtos/krn-menu-item.dto';
import { AdmRoleDto } from '../dtos/adm-role.dto';

@Controller('krn-menu')
export class KrnMenuController {
  constructor(private krnMenuService: KrnMenuService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('exclude-role/:roleId')
  async getKrnMenu(@Request() { user }: { user: UserDto },
                   @Param('roleId') roleId: AdmRoleDto['id']): Promise<KrnMenuItemDto[]> {
    return this.krnMenuService.getMenuItemsExcludeRole(roleId);
  }
}

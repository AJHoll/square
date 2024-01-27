import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserDto } from '../dtos/user.dto';
import { AdmRoleDto } from '../dtos/adm-role.dto';
import { AdmRoleService } from './adm-role.service';
import { AdmRoleMenuDto } from '../dtos/adm-role-menu.dto';
import { AdmGroupDto } from '../dtos/adm-group.dto';

@Controller('adm-role')
export class AdmRoleController {

  constructor(private admRoleService: AdmRoleService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAdmRoles(@Request() { user }: { user: UserDto }): Promise<AdmRoleDto[]> {
    return this.admRoleService.getRoles();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAdmRole(@Request() { user }: { user: UserDto },
                   @Param('id') id: AdmRoleDto['id']): Promise<AdmRoleDto> {
    return this.admRoleService.getRole(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/menu-item')
  async getAdmRoleMenuItems(@Request() { user }: { user: UserDto },
                            @Param('id') id: AdmRoleDto['id']): Promise<AdmRoleMenuDto[]> {
    return this.admRoleService.getRoleMenuItems(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/menu-item/:menuItemIds')
  async addMenuItemsToRole(@Request() { user }: { user: UserDto },
                           @Param('id') idRole: AdmRoleDto['id'],
                           @Param('menuItemIds') menuItemIds: string): Promise<void> {
    await this.admRoleService.addMenuItemsToRole(idRole, menuItemIds.split(',').map(id => +id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/menu-item/:roleMenuIds')
  async removeRoleMenusFromRole(@Request() { user }: { user: UserDto },
                                @Param('id') idRole: AdmRoleDto['id'],
                                @Param('roleMenuIds') roleMenuIds: string): Promise<void> {
    await this.admRoleService.removeRoleMenusFromRole(idRole, roleMenuIds.split(',').map(id => +id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAdmRole(@Request() { user }: { user: UserDto },
                      @Body() admRole: AdmRoleDto): Promise<AdmRoleDto> {
    return this.admRoleService.createRole(admRole);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async editAdmRole(@Request() { user }: { user: UserDto },
                    @Param('id') id: AdmRoleDto['id'],
                    @Body() admRole: AdmRoleDto): Promise<AdmRoleDto> {
    return this.admRoleService.editRole(id, admRole);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':ids')
  async deleteAdmRoles(@Request() { user }: { user: UserDto },
                       @Param('ids') ids: string): Promise<void> {

    await this.admRoleService.deleteRoles(ids.split(',').map(val => +val));
  }

  @UseGuards(JwtAuthGuard)
  @Get('exclude-group/:groupId')
  async getKrnMenu(@Request() { user }: { user: UserDto },
                   @Param('groupId') groupId: AdmGroupDto['id']): Promise<AdmRoleDto[]> {
    return this.admRoleService.getRolesExcludeGroup(groupId);
  }
}

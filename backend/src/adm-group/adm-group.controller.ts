import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {UserDto} from '../dtos/user.dto';
import {AdmGroupService} from './adm-group.service';
import {AdmGroupDto} from '../dtos/adm-group.dto';
import {AdmGroupRoleDto} from '../dtos/adm-group-role.dto';
import {AdmUserDto} from "../dtos/adm-user.dto";
import {HasRoles} from "../guards/roles.decorator";
import {RolesGuard} from "../guards/roles.guard";

@Controller('adm-group')
export class AdmGroupController {

    constructor(private admGroupService: AdmGroupService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAdmRoles(@Request() {user}: { user: UserDto }): Promise<AdmGroupDto[]> {
        return this.admGroupService.getGroups();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getAdmRole(@Request() {user}: { user: UserDto },
                     @Param('id') id: AdmGroupDto['id']): Promise<AdmGroupDto> {
        return this.admGroupService.getGroup(id);
    }

    @HasRoles(['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async createAdmGroup(@Request() {user}: { user: UserDto },
                         @Body() admGroup: AdmGroupDto): Promise<AdmGroupDto> {
        return this.admGroupService.createGroup(admGroup);
    }

    @HasRoles(['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    async editAdmGroup(@Request() {user}: { user: UserDto },
                       @Param('id') id: AdmGroupDto['id'],
                       @Body() admGroup: AdmGroupDto): Promise<AdmGroupDto> {
        return this.admGroupService.editGroup(id, admGroup);
    }

    @HasRoles(['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':ids')
    async deleteAdmGroups(@Request() {user}: { user: UserDto },
                          @Param('ids') ids: string): Promise<void> {
        await this.admGroupService.deleteGroups(ids.split(',').map(val => +val));
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/role')
    async getAdmRoleMenuItems(@Request() {user}: { user: UserDto },
                              @Param('id') id: AdmGroupDto['id']): Promise<AdmGroupRoleDto[]> {
        return this.admGroupService.getGroupRoles(id);
    }

    @HasRoles(['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':id/role/:roleIds')
    async addRolesToGroup(@Request() {user}: { user: UserDto },
                          @Param('id') idGroup: AdmGroupDto['id'],
                          @Param('roleIds') roleIds: string): Promise<void> {
        await this.admGroupService.addRolesToGroup(idGroup, roleIds.split(',').map(id => +id));
    }

    @HasRoles(['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id/role/:groupRoleIds')
    async removeRolesFromGroup(@Request() {user}: { user: UserDto },
                               @Param('id') idGroup: AdmGroupDto['id'],
                               @Param('groupRoleIds') groupRoleIds: string): Promise<void> {
        await this.admGroupService.removeRolesFromGroup(idGroup, groupRoleIds.split(',').map(id => +id));
    }

    @UseGuards(JwtAuthGuard)
    @Get('exclude-user/:userId')
    async getKrnMenu(@Request() {user}: { user: UserDto },
                     @Param('userId') userId: AdmUserDto['id']): Promise<AdmGroupDto[]> {
        return this.admGroupService.getGroupsExcludeUser(userId);
    }
}

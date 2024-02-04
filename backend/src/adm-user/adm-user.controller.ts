import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {UserDto} from "../dtos/user.dto";
import {AdmUserService} from "./adm-user.service";
import {AdmUserDto} from "../dtos/adm-user.dto";
import {AdmUserGroupDto} from "../dtos/adm-user-group.dto";

@Controller('adm-user')
export class AdmUserController {

    constructor(private admUserService: AdmUserService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAdmRoles(@Request() {user}: { user: UserDto }): Promise<AdmUserDto[]> {
        return this.admUserService.getUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getAdmRole(@Request() {user}: { user: UserDto },
                     @Param('id') id: AdmUserDto['id']): Promise<AdmUserDto> {
        return this.admUserService.getUser(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createAdmGroup(@Request() {user}: { user: UserDto },
                         @Body() admUser: AdmUserDto): Promise<AdmUserDto> {
        return this.admUserService.createUser(admUser);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async editAdmGroup(@Request() {user}: { user: UserDto },
                       @Param('id') id: AdmUserDto['id'],
                       @Body() admUser: AdmUserDto): Promise<AdmUserDto> {
        return this.admUserService.editUser(id, admUser);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':ids')
    async deleteAdmGroups(@Request() {user}: { user: UserDto },
                          @Param('ids') ids: string): Promise<void> {
        await this.admUserService.deleteUsers(ids.split(',').map(val => +val));
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/group')
    async getAdmRoleMenuItems(@Request() {user}: { user: UserDto },
                              @Param('id') id: AdmUserDto['id']): Promise<AdmUserGroupDto[]> {
        return this.admUserService.getUserGroups(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/group/:groupIds')
    async addRolesToGroup(@Request() {user}: { user: UserDto },
                          @Param('id') idUser: AdmUserDto['id'],
                          @Param('groupIds') groupIds: string): Promise<void> {
        await this.admUserService.addGroupsToUser(idUser, groupIds.split(',').map(id => +id));
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/group/:userGroupIds')
    async removeRolesFromGroup(@Request() {user}: { user: UserDto },
                               @Param('id') idUser: AdmUserDto['id'],
                               @Param('userGroupIds') userGroupIds: string): Promise<void> {
        await this.admUserService.removeGroupsFromUser(idUser, userGroupIds.split(',').map(id => +id));
    }
}

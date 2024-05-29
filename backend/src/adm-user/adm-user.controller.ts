import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {UserDto} from "../dtos/user.dto";
import {AdmUserService} from "./adm-user.service";
import {AdmUserDto} from "../dtos/adm-user.dto";
import {AdmUserGroupDto} from "../dtos/adm-user-group.dto";
import {HasRoles} from "../guards/roles.decorator";
import {RolesGuard} from "../guards/roles.guard";
import {FileInterceptor} from "@nestjs/platform-express";

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

    @HasRoles(['admin', 'userManager'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async createAdmGroup(@Request() {user}: { user: UserDto },
                         @Body() admUser: AdmUserDto): Promise<AdmUserDto> {
        return this.admUserService.createUser(admUser);
    }

    @HasRoles(['admin', 'userManager'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    async editAdmGroup(@Request() {user}: { user: UserDto },
                       @Param('id') id: AdmUserDto['id'],
                       @Body() admUser: AdmUserDto): Promise<AdmUserDto> {
        return this.admUserService.editUser(id, admUser);
    }

    @HasRoles(['admin', 'userManager'])
    @UseGuards(JwtAuthGuard, RolesGuard)
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

    @HasRoles(['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':id/group/:groupIds')
    async addRolesToGroup(@Request() {user}: { user: UserDto },
                          @Param('id') idUser: AdmUserDto['id'],
                          @Param('groupIds') groupIds: string): Promise<void> {
        await this.admUserService.addGroupsToUser(idUser, groupIds.split(',').map(id => +id));
    }

    @HasRoles(['admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id/group/:userGroupIds')
    async removeRolesFromGroup(@Request() {user}: { user: UserDto },
                               @Param('id') idUser: AdmUserDto['id'],
                               @Param('userGroupIds') userGroupIds: string): Promise<void> {
        await this.admUserService.removeGroupsFromUser(idUser, userGroupIds.split(',').map(id => +id));
    }

    @HasRoles(['userManager', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('download-import-template')
    async downloadImportTemplate(@Request() {user}: { user: UserDto }): Promise<StreamableFile> {
        return this.admUserService.downloadImportTemplate();
    }

    @HasRoles(['userManager', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('import-users')
    @UseInterceptors(FileInterceptor('file'))
    async loadFromXlsx(@Request() {user}: { user: UserDto },
                       @UploadedFile() file: Express.Multer.File): Promise<void> {
        return this.admUserService.importUsers(file);
    }
}

import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {UserDto} from '../dtos/user.dto';
import {SqrRoleService} from './sqr-role.service';
import {SqrRoleDto} from "../dtos/sqr-role.dto";

@Controller('sqr-role')
export class SqrRoleController {

    constructor(private sqrRoleService: SqrRoleService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSqrRoles(@Request() {user}: { user: UserDto }): Promise<SqrRoleDto[]> {
        return this.sqrRoleService.getRoles();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getSqrRole(@Request() {user}: { user: UserDto },
                     @Param('id') id: SqrRoleDto['id']): Promise<SqrRoleDto> {
        return this.sqrRoleService.getRole(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createSqrRole(@Request() {user}: { user: UserDto },
                        @Body() admRole: SqrRoleDto): Promise<SqrRoleDto> {
        return this.sqrRoleService.createRole(admRole);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async editSqrRole(@Request() {user}: { user: UserDto },
                      @Param('id') id: SqrRoleDto['id'],
                      @Body() admRole: SqrRoleDto): Promise<SqrRoleDto> {
        return this.sqrRoleService.editRole(id, admRole);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':ids')
    async deleteSqrRoles(@Request() {user}: { user: UserDto },
                         @Param('ids') ids: string): Promise<void> {

        await this.sqrRoleService.deleteRoles(ids.split(',').map(val => +val));
    }
}

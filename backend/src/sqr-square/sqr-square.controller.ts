import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseArrayPipe,
    ParseBoolPipe,
    Post,
    Put,
    Query,
    Request,
    UseGuards
} from '@nestjs/common';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {UserDto} from '../dtos/user.dto';
import {SqrSquareService} from './sqr-square.service';
import {SqrSquareDto} from "../dtos/sqr-square.dto";
import {SqrRoleDto} from "../dtos/sqr-role.dto";
import {SqrSquareUserDto} from "../dtos/sqr-square-user.dto";

@Controller('sqr-square')
export class SqrSquareController {

    constructor(private sqrRoleService: SqrSquareService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSquares(@Request() {user}: { user: UserDto }): Promise<SqrSquareDto[]> {
        return this.sqrRoleService.getSquares();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getSquare(@Request() {user}: { user: UserDto },
                    @Param('id') id: SqrSquareDto['id']): Promise<SqrSquareDto> {
        return this.sqrRoleService.getSquare(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createSquare(@Request() {user}: { user: UserDto },
                       @Body() admRole: SqrSquareDto): Promise<SqrSquareDto> {
        return this.sqrRoleService.createSquare(admRole);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async editSquare(@Request() {user}: { user: UserDto },
                     @Param('id') id: SqrSquareDto['id'],
                     @Body() admRole: SqrSquareDto): Promise<SqrSquareDto> {
        return this.sqrRoleService.editSquare(id, admRole);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':ids')
    async deleteSquares(@Request() {user}: { user: UserDto },
                        @Param('ids') ids: string): Promise<void> {

        await this.sqrRoleService.deleteSquares(ids.split(',').map(val => +val));
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/sqr-role')
    async getSquareRoles(@Request() {user}: { user: UserDto },
                         @Param('id') id: SqrSquareDto['id']): Promise<SqrRoleDto[]> {
        return this.sqrRoleService.getSquareRoles(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/sqr-role/:roleId/user')
    async getSquareRoleUsers(@Request() {user}: { user: UserDto },
                             @Param('id') id: SqrSquareDto['id'],
                             @Param('roleId') roleId: SqrRoleDto['id'],
                             @Query('showAllUsers', ParseBoolPipe) showAllUsers: boolean,
                             @Query('fastFilter') fastFilter: string
    ): Promise<SqrSquareUserDto[]> {
        return this.sqrRoleService.getSquareRoleUsers(id, roleId, fastFilter, showAllUsers);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/sqr-role/:roleIds/user/:userIds')
    async addUsersToSquareRole(@Request() {user}: { user: UserDto },
                               @Param('id') id: SqrSquareDto['id'],
                               @Param('roleIds', ParseArrayPipe) roleIds: SqrRoleDto['id'][],
                               @Param('userIds', ParseArrayPipe) userIds: SqrSquareUserDto['id'][]
    ): Promise<void> {
        await this.sqrRoleService.addUsersToSquareRole(id, roleIds, userIds);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/sqr-role/:roleIds/user/:userIds')
    async removeUsersFromSquareRole(@Request() {user}: { user: UserDto },
                                    @Param('id') id: SqrSquareDto['id'],
                                    @Param('roleIds', ParseArrayPipe) roleIds: SqrRoleDto['id'][],
                                    @Param('userIds', ParseArrayPipe) userIds: SqrSquareUserDto['id'][]
    ): Promise<void> {
        await this.sqrRoleService.removeUsersFromSquareRole(id, roleIds, userIds);
    }
}

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseArrayPipe,
    ParseBoolPipe,
    ParseFloatPipe,
    ParseIntPipe,
    Patch,
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
import {SqrTeamDto} from "../dtos/sqr-team.dto";
import {SqrSquareTeamUserDto} from "../dtos/sqr-square-team-user.dto";
import {SqrTimerDto} from "../dtos/sqr-timer.dto";

@Controller('sqr-square')
export class SqrSquareController {

    constructor(private sqrRoleService: SqrSquareService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSquares(@Request() {user}: { user: UserDto }): Promise<SqrSquareDto[]> {
        return this.sqrRoleService.getSquares(user);
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
    async getSquareRoles(@Request() {user}: { user: UserDto }): Promise<SqrRoleDto[]> {
        return this.sqrRoleService.getSquareRoles();
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

    @UseGuards(JwtAuthGuard)
    @Get(':squareId/sqr-team')
    async getSquareTeams(@Request() {user}: { user: UserDto },
                         @Param('squareId') squareId: SqrSquareDto['id']): Promise<SqrTeamDto[]> {
        return this.sqrRoleService.getSquareTeams(squareId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':squareId/sqr-team/:teamId')
    async getSquareTeam(@Request() {user}: { user: UserDto },
                        @Param('squareId') squareId: SqrSquareDto['id'],
                        @Param('teamId') teamId: SqrTeamDto['id'],
    ): Promise<SqrTeamDto> {
        return this.sqrRoleService.getSquareTeam(squareId, teamId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':squareId/sqr-team/')
    async createSquareTeam(@Request() {user}: { user: UserDto },
                           @Param('squareId') squareId: SqrSquareDto['id'],
                           @Body() sqrTeam: SqrTeamDto): Promise<SqrTeamDto> {
        return this.sqrRoleService.createSquareTeam(squareId, sqrTeam);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':squareId/sqr-team/:teamId')
    async editSquareTeam(@Request() {user}: { user: UserDto },
                         @Param('squareId') squareId: SqrSquareDto['id'],
                         @Param('teamId') teamId: SqrTeamDto['id'],
                         @Body() sqrTeam: SqrTeamDto): Promise<SqrTeamDto> {
        return this.sqrRoleService.editSquareTeam(squareId, teamId, sqrTeam);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':squareId/sqr-team/:teamIds')
    async deleteSquareTeams(@Request() {user}: { user: UserDto },
                            @Param('squareId') squareId: SqrSquareDto['id'],
                            @Param('teamIds', ParseArrayPipe) teamIds: string[]): Promise<void> {
        await this.sqrRoleService.deleteSquareTeams(squareId, teamIds.map(val => +val));
    }

    @UseGuards(JwtAuthGuard)
    @Get(':squareId/sqr-team/:teamId/user')
    async getSquareTeamUsers(@Request() {user}: { user: UserDto },
                             @Param('squareId') squareId: SqrSquareDto['id'],
                             @Param('teamId', ParseFloatPipe) teamId: SqrTeamDto['id'],
                             @Query('showAllUsers', ParseBoolPipe) showAllUsers: boolean,
                             @Query('fastFilter') fastFilter: string
    ): Promise<SqrSquareTeamUserDto[]> {
        return this.sqrRoleService.getSquareTeamUsers(squareId, teamId, showAllUsers, fastFilter);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':squareId/sqr-team/:teamIds/user/:userIds')
    async addUsersToSquareTeams(@Request() {user}: { user: UserDto },
                                @Param('squareId') squareId: SqrSquareDto['id'],
                                @Param('teamIds', ParseArrayPipe) teamIds: SqrTeamDto['id'][],
                                @Param('userIds', ParseArrayPipe) userIds: SqrSquareUserDto['id'][]
    ): Promise<void> {
        await this.sqrRoleService.addUsersToSquareTeams(squareId, teamIds, userIds);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':squareId/sqr-team/:teamIds/user/:userIds')
    async removeUsersFromSquareTeams(@Request() {user}: { user: UserDto },
                                     @Param('squareId') squareId: SqrSquareDto['id'],
                                     @Param('teamIds', ParseArrayPipe) teamIds: SqrTeamDto['id'][],
                                     @Param('userIds', ParseArrayPipe) userIds: SqrSquareUserDto['id'][]
    ): Promise<void> {
        await this.sqrRoleService.removeUsersFromSquareTeams(squareId, teamIds, userIds);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':squareId/sqr-timer')
    async getSquareTimers(@Request() {user}: { user: UserDto },
                          @Param('squareId') squareId: SqrSquareDto['id']): Promise<SqrTimerDto[]> {
        return this.sqrRoleService.getSquareTimers(squareId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':squareId/sqr-timer/recreate')
    async recreateSquareTimers(@Request() {user}: { user: UserDto },
                               @Param('squareId') squareId: SqrSquareDto['id']): Promise<void> {
        await this.sqrRoleService.recreateSquareTimers(squareId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':squareId/sqr-timer/set-count/:count')
    async setAllTimerCount(@Request() {user}: { user: UserDto },
                           @Param('squareId') squareId: SqrSquareDto['id'],
                           @Param('count', ParseIntPipe) count: SqrTimerDto['count']): Promise<void> {
        await this.sqrRoleService.setTimerCount(squareId, count);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':squareId/sqr-timer/:timerId/set-count/:count')
    async setTimerCount(@Request() {user}: { user: UserDto },
                        @Param('squareId') squareId: SqrSquareDto['id'],
                        @Param('timerId') timerId: SqrTimerDto['id'],
                        @Param('count', ParseIntPipe) count: SqrTimerDto['count']): Promise<void> {
        await this.sqrRoleService.setTimerCount(squareId, count, timerId);
    }
}

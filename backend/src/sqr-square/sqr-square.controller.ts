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
    StreamableFile,
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
import {SqrSquareEvalGroupDto} from "../dtos/sqr-square-eval-group.dto";
import {SqrSquareEvalGroupUserDto} from "../dtos/sqr-square-eval-group-user.dto";
import {HasRoles} from "../guards/roles.decorator";
import {RolesGuard} from "../guards/roles.guard";

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

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async createSquare(@Request() {user}: { user: UserDto },
                       @Body() admRole: SqrSquareDto): Promise<SqrSquareDto> {
        return this.sqrRoleService.createSquare(admRole);
    }

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    async editSquare(@Request() {user}: { user: UserDto },
                     @Param('id') id: SqrSquareDto['id'],
                     @Body() admRole: SqrSquareDto): Promise<SqrSquareDto> {
        return this.sqrRoleService.editSquare(id, admRole);
    }

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
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

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':id/sqr-role/:roleIds/user/:userIds')
    async addUsersToSquareRole(@Request() {user}: { user: UserDto },
                               @Param('id') id: SqrSquareDto['id'],
                               @Param('roleIds', ParseArrayPipe) roleIds: SqrRoleDto['id'][],
                               @Param('userIds', ParseArrayPipe) userIds: SqrSquareUserDto['id'][]
    ): Promise<void> {
        await this.sqrRoleService.addUsersToSquareRole(id, roleIds, userIds);
    }

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
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

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/sqr-team/')
    async createSquareTeam(@Request() {user}: { user: UserDto },
                           @Param('squareId') squareId: SqrSquareDto['id'],
                           @Body() sqrTeam: SqrTeamDto): Promise<SqrTeamDto> {
        return this.sqrRoleService.createSquareTeam(squareId, sqrTeam);
    }

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':squareId/sqr-team/:teamId')
    async editSquareTeam(@Request() {user}: { user: UserDto },
                         @Param('squareId') squareId: SqrSquareDto['id'],
                         @Param('teamId') teamId: SqrTeamDto['id'],
                         @Body() sqrTeam: SqrTeamDto): Promise<SqrTeamDto> {
        return this.sqrRoleService.editSquareTeam(squareId, teamId, sqrTeam);
    }

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
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

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/sqr-team/:teamIds/user/:userIds')
    async addUsersToSquareTeams(@Request() {user}: { user: UserDto },
                                @Param('squareId') squareId: SqrSquareDto['id'],
                                @Param('teamIds', ParseArrayPipe) teamIds: SqrTeamDto['id'][],
                                @Param('userIds', ParseArrayPipe) userIds: SqrSquareUserDto['id'][]
    ): Promise<void> {
        await this.sqrRoleService.addUsersToSquareTeams(squareId, teamIds, userIds);
    }

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
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
    @Get(':squareId/sqr-timer/:timerId')
    async getSquareTimer(@Request() {user}: { user: UserDto },
                         @Param('squareId') squareId: SqrSquareDto['id'],
                         @Param('timerId') timerId: SqrTimerDto['id']): Promise<SqrTimerDto> {
        return this.sqrRoleService.getSquareTimer(squareId, timerId);
    }

    @HasRoles(['squareManage', 'timerManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/sqr-timer/recreate')
    async recreateSquareTimers(@Request() {user}: { user: UserDto },
                               @Param('squareId') squareId: SqrSquareDto['id']): Promise<void> {
        await this.sqrRoleService.recreateSquareTimer(squareId);
    }

    @HasRoles(['squareManage', 'timerManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/sqr-timer/:timerId/recreate')
    async recreateSquareTimer(@Request() {user}: { user: UserDto },
                              @Param('squareId') squareId: SqrSquareDto['id'],
                              @Param('timerId') timerId: SqrTimerDto['id']): Promise<void> {
        await this.sqrRoleService.recreateSquareTimer(squareId, timerId);
    }

    @HasRoles(['squareManage', 'timerManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':squareId/sqr-timer/set-count/:count')
    async setAllTimerCount(@Request() {user}: { user: UserDto },
                           @Param('squareId') squareId: SqrSquareDto['id'],
                           @Param('count', ParseIntPipe) count: SqrTimerDto['count']): Promise<void> {
        await this.sqrRoleService.setTimerCount(squareId, count);
    }

    @HasRoles(['squareManage', 'timerManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':squareId/sqr-timer/:timerId/set-count/:count')
    async setTimerCount(@Request() {user}: { user: UserDto },
                        @Param('squareId') squareId: SqrSquareDto['id'],
                        @Param('timerId') timerId: SqrTimerDto['id'],
                        @Param('count', ParseIntPipe) count: SqrTimerDto['count']): Promise<void> {
        await this.sqrRoleService.setTimerCount(squareId, count, timerId);
    }

    @HasRoles(['squareManage', 'timerManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/sqr-timer/start')
    async startAllTimers(@Request() {user}: { user: UserDto },
                         @Param('squareId') squareId: SqrSquareDto['id']): Promise<void> {
        await this.sqrRoleService.startTimer(squareId);
    }

    @HasRoles(['squareManage', 'timerManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/sqr-timer/:timerId/start')
    async startTimer(@Request() {user}: { user: UserDto },
                     @Param('squareId') squareId: SqrSquareDto['id'],
                     @Param('timerId') timerId: SqrTimerDto['id']): Promise<void> {
        await this.sqrRoleService.startTimer(squareId, timerId);
    }

    @HasRoles(['squareManage', 'timerManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/sqr-timer/pause')
    async pauseAllTimers(@Request() {user}: { user: UserDto },
                         @Param('squareId') squareId: SqrSquareDto['id'],
                         @Body() body: { description: string }): Promise<void> {
        await this.sqrRoleService.pauseTimer(squareId, body.description);
    }

    @HasRoles(['squareManage', 'timerManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/sqr-timer/:timerId/pause')
    async pauseTimer(@Request() {user}: { user: UserDto },
                     @Param('squareId') squareId: SqrSquareDto['id'],
                     @Param('timerId') timerId: SqrTimerDto['id'],
                     @Body() body: { description: string }): Promise<void> {
        await this.sqrRoleService.pauseTimer(squareId, body.description, timerId);
    }

    @HasRoles(['squareManage', 'timerManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/sqr-timer/stop')
    async stopAllTimers(@Request() {user}: { user: UserDto },
                        @Param('squareId') squareId: SqrSquareDto['id']): Promise<void> {
        await this.sqrRoleService.stopTimer(user, squareId);
    }

    @HasRoles(['squareManage', 'timerManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/sqr-timer/:timerId/stop')
    async stopTimer(@Request() {user}: { user: UserDto },
                    @Param('squareId') squareId: SqrSquareDto['id'],
                    @Param('timerId') timerId: SqrTimerDto['id']): Promise<void> {
        await this.sqrRoleService.stopTimer(user, squareId, timerId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':squareId/sqr-eval-group')
    async getSquareEvalGroups(@Request() {user}: { user: UserDto },
                              @Param('squareId') squareId: SqrSquareDto['id']): Promise<SqrSquareEvalGroupDto[]> {
        return this.sqrRoleService.getSquareEvalGroups(squareId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':squareId/sqr-eval-group/:evalGroupId')
    async getSquareEvalGroup(@Request() {user}: { user: UserDto },
                             @Param('squareId') squareId: SqrSquareDto['id'],
                             @Param('evalGroupId', ParseFloatPipe) evalGroupId: SqrSquareEvalGroupDto['id']
    ): Promise<SqrSquareEvalGroupDto> {
        return this.sqrRoleService.getSquareEvalGroup(squareId, evalGroupId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':squareId/sqr-eval-group/:evalGroupId/user')
    async getSquareEvalGroupUsers(@Request() {user}: { user: UserDto },
                                  @Param('squareId') squareId: SqrSquareDto['id'],
                                  @Param('evalGroupId', ParseFloatPipe) evalGroupId: SqrSquareEvalGroupDto['id'],
                                  @Query('showAllUsers', ParseBoolPipe) showAllUsers: boolean,
                                  @Query('fastFilter') fastFilter: string
    ): Promise<SqrSquareEvalGroupUserDto[]> {
        return this.sqrRoleService.getSquareEvalGroupUsers(squareId, evalGroupId, showAllUsers, fastFilter);
    }

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/sqr-eval-group')
    async createSquareEvalGroup(@Request() {user}: { user: UserDto },
                                @Param('squareId') squareId: SqrSquareDto['id'],
                                @Body() sqrEvalGroup: SqrSquareEvalGroupDto): Promise<SqrSquareEvalGroupDto> {
        return this.sqrRoleService.createSquareEvalGroup(squareId, sqrEvalGroup);
    }

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':squareId/sqr-eval-group/:sqrEvalGroupId')
    async editSquareEvalGroup(@Request() {user}: { user: UserDto },
                              @Param('squareId') squareId: SqrSquareDto['id'],
                              @Param('sqrEvalGroupId') sqrEvalGroupId: SqrSquareEvalGroupDto['id'],
                              @Body() sqrEvalGroup: SqrSquareEvalGroupDto): Promise<SqrSquareEvalGroupDto> {
        return this.sqrRoleService.editSquareEvalGroup(squareId, sqrEvalGroupId, sqrEvalGroup);
    }

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':squareId/sqr-eval-group/:sqrEvalGroupIds')
    async deleteSquareEvalGroups(@Request() {user}: { user: UserDto },
                                 @Param('squareId') squareId: SqrSquareDto['id'],
                                 @Param('sqrEvalGroupIds', ParseArrayPipe) sqrEvalGroupIds: string[]): Promise<void> {
        await this.sqrRoleService.deleteSquareEvalGroups(squareId, sqrEvalGroupIds.map(val => +val));
    }

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/sqr-eval-group/:sqrEvalGroupIds/user/:userIds')
    async addUsersToEvalGroups(@Request() {user}: { user: UserDto },
                               @Param('squareId') squareId: SqrSquareDto['id'],
                               @Param('sqrEvalGroupIds', ParseArrayPipe) sqrEvalGroupIds: SqrSquareEvalGroupDto['id'][],
                               @Param('userIds', ParseArrayPipe) userIds: SqrSquareEvalGroupUserDto['id'][]
    ): Promise<void> {
        await this.sqrRoleService.addUsersToEvalGroups(squareId, sqrEvalGroupIds, userIds);
    }

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':squareId/sqr-eval-group/:sqrEvalGroupIds/user/:userIds')
    async removeUsersFromEvalGroups(@Request() {user}: { user: UserDto },
                                    @Param('squareId') squareId: SqrSquareDto['id'],
                                    @Param('sqrEvalGroupIds', ParseArrayPipe) sqrEvalGroupIds: SqrSquareEvalGroupDto['id'][],
                                    @Param('userIds', ParseArrayPipe) userIds: SqrSquareEvalGroupUserDto['id'][]
    ): Promise<void> {
        await this.sqrRoleService.removeUsersFromEvalGroups(squareId, sqrEvalGroupIds, userIds);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':squareId/timer-pause-report')
    async saveTolsx(@Request() {user}: { user: UserDto },
                    @Param('squareId') squareId: SqrSquareDto['id']): Promise<StreamableFile> {
        return this.sqrRoleService.getTimerPauseReport(squareId);
    }

    @HasRoles(['squareManage', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':squareId/export-square-role-user')
    async exportSquareRoleUser(@Request() {user}: { user: UserDto },
                               @Param('squareId') squareId: SqrSquareDto['id']): Promise<StreamableFile> {
        return this.sqrRoleService.exportSquareRoleUser(squareId);
    }
}

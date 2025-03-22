import RootService from "./Root.service";
import {makeAutoObservable} from "mobx";
import axios from "axios";
import {SqrSquareDto} from "../dtos/SqrSquare.dto";
import {SqrRoleDto} from "../dtos/SqrRole.dto";
import {SqrSquareUserDto} from "../dtos/SqrSquareUser.dto";
import {UFilterItem} from "../components/DevsGrid/DevsGridFilterItem";
import {SqrTeamDto} from "../dtos/SqrTeam.dto";
import {SqrSquareTeamUserDto} from "../dtos/SqrSquareTeamUserDto";
import {SqrTimerDto} from "../dtos/SqrTimer.dto";
import {SqrSquareEvalGroupDto} from "../dtos/SqrSquareEvalGroup.dto";
import {SqrSquareEvalGroupUserDto} from "../dtos/SqrSquareEvalGroupUser.dto";
import {SqrSquareModuleDto} from "../dtos/SqrSquareModule.dto";

export default class SqrSquareService {
    private readonly _rootService: RootService;

    get restPath(): string {
        return `${this._rootService.restUrl}/sqr-square`;
    }

    constructor(rootService: RootService) {
        this._rootService = rootService;
        makeAutoObservable(this);
    }

    async getSquares(): Promise<SqrSquareDto[]> {
        return (await axios.get<SqrSquareDto[]>(`${this.restPath}`)).data;
    }

    async getSquare(id: SqrSquareDto['id']): Promise<SqrSquareDto> {
        return (await axios.get<SqrSquareDto>(`${this.restPath}/${id}`)).data;
    }

    async createSquare(sqrSquare: SqrSquareDto): Promise<SqrSquareDto> {
        return (await axios.post<SqrSquareDto>(`${this.restPath}`, sqrSquare)).data;
    }

    async editSquare(id: SqrSquareDto['id'], sqrSquare: SqrSquareDto): Promise<SqrSquareDto> {
        return (await axios.put<SqrSquareDto>(`${this.restPath}/${id}`, sqrSquare)).data;
    }

    async deleteSquares(ids: SqrSquareDto['id'][]): Promise<void> {
        await axios.delete(`${this.restPath}/${ids.join(',')}`);
    }

    async getSquareRoles(squareId: SqrSquareDto['id']): Promise<SqrRoleDto[]> {
        if (!squareId) {
            return [];
        }
        return (await axios.get<SqrRoleDto[]>(`${this.restPath}/${squareId}/sqr-role`)).data;
    }

    async getSquareRoleUsers(squareId: SqrSquareDto['id'], roleId: SqrRoleDto['id'], filters: {
        [p: string]: UFilterItem
    }, showAllUsers: boolean): Promise<SqrSquareUserDto[]> {
        if (!squareId || !roleId) {
            return [];
        }
        return (await axios.get<SqrSquareUserDto[]>(`${this.restPath}/${squareId}/sqr-role/${roleId}/user`, {
            params: {
                showAllUsers,
                fastFilter: filters['fast_filter']?.value !== undefined && filters['fast_filter']?.value !== '' ? filters['fast_filter'].value : undefined
            }
        })).data;
    }

    async addUsersToSquareRole(squareId: SqrSquareDto['id'],
                               userIds: SqrSquareUserDto['id'][],
                               roleIds: SqrRoleDto['id'][]): Promise<void> {
        await axios.post(`${this.restPath}/${squareId}/sqr-role/${roleIds.join(',')}/user/${userIds.join(',')}`, {});
    }

    async removeUsersFromSquareRole(squareId: SqrSquareDto['id'],
                                    userIds: SqrSquareUserDto['id'][],
                                    roleIds: SqrRoleDto['id'][]): Promise<void> {
        await axios.delete(`${this.restPath}/${squareId}/sqr-role/${roleIds.join(',')}/user/${userIds.join(',')}`, {});
    }

    async getSquareTeams(squareId: SqrSquareDto['id']): Promise<SqrTeamDto[]> {
        if (!squareId) {
            return [];
        }
        return (await axios.get<SqrTeamDto[]>(`${this.restPath}/${squareId}/sqr-team`)).data;
    }

    async getSquareTeam(squareId: SqrSquareDto['id'], teamId: SqrTeamDto['id']): Promise<SqrTeamDto> {
        return (await axios.get<SqrTeamDto>(`${this.restPath}/${squareId}/sqr-team/${teamId}`)).data;
    }

    async deleteTeams(squareId: SqrSquareDto['id'], teamIds: SqrTeamDto['id'][]): Promise<void> {
        await axios.delete<void>(`${this.restPath}/${squareId}/sqr-team/${teamIds.join(',')}`);
    }

    async createTeam(squareId: SqrSquareDto['id'], team: SqrTeamDto): Promise<SqrTeamDto> {
        return (await axios.post<SqrTeamDto>(`${this.restPath}/${squareId}/sqr-team`, team)).data;
    }

    async editTeam(squareId: SqrSquareDto['id'], teamId: SqrTeamDto['id'], team: SqrTeamDto): Promise<SqrTeamDto> {
        return (await axios.put<SqrTeamDto>(`${this.restPath}/${squareId}/sqr-team/${teamId}`, team)).data;
    }

    async getSquareTeamUsers(squareId: SqrSquareDto['id'],
                             teamId: SqrTeamDto['id'],
                             filters: {
                                 [p: string]: UFilterItem
                             },
                             showAllUsers: boolean): Promise<SqrSquareTeamUserDto[]> {
        if (!squareId || !teamId) {
            return [];
        }
        return (await axios.get<SqrSquareTeamUserDto[]>(`${this.restPath}/${squareId}/sqr-team/${teamId}/user`, {
            params: {
                showAllUsers,
                fastFilter: filters['fast_filter']?.value !== undefined && filters['fast_filter']?.value !== '' ? filters['fast_filter'].value : undefined
            }
        })).data;
    }

    async addUsersToSquareTeam(squareId: SqrSquareDto['id'],
                               userIds: SqrSquareTeamUserDto['id'][],
                               teamIds: SqrTeamDto['id'][]): Promise<void> {
        await axios.post(`${this.restPath}/${squareId}/sqr-team/${teamIds.join(',')}/user/${userIds.join(',')}`, {});
    }

    async removeUsersFromSquareTeam(squareId: SqrSquareDto['id'],
                                    userIds: SqrSquareTeamUserDto['id'][],
                                    teamIds: SqrTeamDto['id'][]): Promise<void> {
        await axios.delete(`${this.restPath}/${squareId}/sqr-team/${teamIds.join(',')}/user/${userIds.join(',')}`, {});
    }

    async getSquareTimers(squareId: SqrSquareDto['id']): Promise<SqrTimerDto[]> {
        return (await axios.get<SqrTimerDto[]>(`${this.restPath}/${squareId}/sqr-timer`)).data;
    }

    async getSquareTimer(squareId: SqrSquareDto['id'], timerId: SqrTimerDto['id']): Promise<SqrTimerDto> {
        return (await axios.get<SqrTimerDto>(`${this.restPath}/${squareId}/sqr-timer/${timerId}`)).data;
    }

    async recreateTimer(squareId: SqrSquareDto['id'], timerId?: SqrTimerDto['id']): Promise<void> {
        if (timerId) {
            await axios.post<void>(`${this.restPath}/${squareId}/sqr-timer/${timerId}/recreate`);
        } else {
            await axios.post<void>(`${this.restPath}/${squareId}/sqr-timer/recreate`);
        }
    }

    async setAllTimerCount(squareId: SqrSquareDto['id'],
                           count: SqrTimerDto['count']): Promise<void> {
        await axios.patch<void>(`${this.restPath}/${squareId}/sqr-timer/set-count/${count}`);
    }

    async setTimerCount(squareId: SqrSquareDto['id'],
                        timerId: SqrTimerDto['id'],
                        count: SqrTimerDto['count']): Promise<void> {
        await axios.patch<void>(`${this.restPath}/${squareId}/sqr-timer/${timerId}/set-count/${count}`);
    }

    async startTimer(squareId: SqrSquareDto['id'],
                     timerId?: SqrTimerDto['id']): Promise<void> {
        if (timerId) {
            await axios.post<void>(`${this.restPath}/${squareId}/sqr-timer/${timerId}/start`);
        } else {
            await axios.post<void>(`${this.restPath}/${squareId}/sqr-timer/start`);
        }
    }

    async pauseTimer(squareId: SqrSquareDto['id'],
                     description: string,
                     timerId?: SqrTimerDto['id']): Promise<void> {
        if (timerId) {
            await axios.post<void>(`${this.restPath}/${squareId}/sqr-timer/${timerId}/pause`, {description});
        } else {
            await axios.post<void>(`${this.restPath}/${squareId}/sqr-timer/pause`, {description});
        }
    }

    async stopTimer(squareId: SqrSquareDto['id'],
                    timerId?: SqrTimerDto['id']): Promise<void> {
        if (timerId) {
            await axios.post<void>(`${this.restPath}/${squareId}/sqr-timer/${timerId}/stop`);
        } else {
            await axios.post<void>(`${this.restPath}/${squareId}/sqr-timer/stop`);
        }
    }

    async getSquareEvalGroups(squareId: SqrSquareDto['id']): Promise<SqrSquareEvalGroupDto[]> {
        if (!squareId) {
            return [];
        }
        return (await axios.get<SqrSquareEvalGroupDto[]>(`${this.restPath}/${squareId}/sqr-eval-group`)).data;
    }

    async getSquareEvalGroup(squareId: SqrSquareDto['id'], evalGroupId: SqrSquareEvalGroupDto['id']): Promise<SqrSquareEvalGroupDto> {
        return (await axios.get<SqrSquareEvalGroupDto>(`${this.restPath}/${squareId}/sqr-eval-group/${evalGroupId}`)).data;
    }

    async getSquareEvalGroupUsers(squareId: SqrSquareDto['id'],
                                  evalGroupId: SqrSquareEvalGroupDto['id'],
                                  filters: { [p: string]: UFilterItem },
                                  showAllUsers: boolean): Promise<SqrSquareEvalGroupUserDto[]> {
        if (!squareId || !evalGroupId) {
            return [];
        }
        return (await axios.get<SqrSquareEvalGroupUserDto[]>(`${this.restPath}/${squareId}/sqr-eval-group/${evalGroupId}/user`,
            {
                params: {
                    showAllUsers,
                    fastFilter: filters['fast_filter']?.value !== undefined && filters['fast_filter']?.value !== '' ? filters['fast_filter'].value : undefined
                }
            })).data;
    }

    async createEvalGroup(squareId: SqrSquareDto['id'], evalGroup: SqrSquareEvalGroupDto): Promise<SqrSquareEvalGroupDto> {
        return (await axios.post<SqrSquareEvalGroupDto>(`${this.restPath}/${squareId}/sqr-eval-group`, evalGroup)).data;
    }

    async editEvalGroup(squareId: SqrSquareDto['id'], evalGroupId: SqrSquareEvalGroupDto['id'], evalGroup: SqrSquareEvalGroupDto): Promise<SqrSquareEvalGroupDto> {
        return (await axios.put<SqrSquareEvalGroupDto>(`${this.restPath}/${squareId}/sqr-eval-group/${evalGroupId}`, evalGroup)).data;
    }

    async deleteEvalGroups(squareId: SqrSquareDto['id'],
                           evalGroupIds: SqrSquareEvalGroupDto['id'][]): Promise<void> {
        await axios.delete<void>(`${this.restPath}/${squareId}/sqr-eval-group/${evalGroupIds.join(',')}`);
    }

    async addUsersToEvalGroup(squareId: SqrSquareDto['id'],
                              userIds: SqrSquareEvalGroupUserDto['id'][],
                              evalGroupIds: SqrSquareEvalGroupDto['id'][]): Promise<void> {
        await axios.post(`${this.restPath}/${squareId}/sqr-eval-group/${evalGroupIds.join(',')}/user/${userIds.join(',')}`, {});
    }

    async removeUsersFromEvalGroup(squareId: SqrSquareDto['id'],
                                   userIds: SqrSquareEvalGroupUserDto['id'][],
                                   evalGroupIds: SqrSquareEvalGroupDto['id'][]): Promise<void> {
        await axios.delete(`${this.restPath}/${squareId}/sqr-eval-group/${evalGroupIds.join(',')}/user/${userIds.join(',')}`, {});
    }

    async downloadTimerPauseReport(squareId: SqrSquareDto['id']): Promise<ArrayBuffer> {
        return (await axios.post<ArrayBuffer>(`${this.restPath}/${squareId}/timer-pause-report`, {}, {
            responseType: 'arraybuffer'
        }))?.data;
    }

    async exportSquareRoleUsers(squareId: SqrSquareDto['id']): Promise<ArrayBuffer> {
        return (await axios.post<ArrayBuffer>(`${this.restPath}/${squareId}/export-square-role-user`, {}, {
            responseType: 'arraybuffer'
        }))?.data;
    }

    async setColorToEvalGroupUser(squareId: SqrSquareDto['id'],
                                  userIds: SqrSquareEvalGroupUserDto['id'][],
                                  evalGroupIds: SqrSquareEvalGroupDto['id'][],
                                  color: SqrSquareEvalGroupUserDto['color']): Promise<void> {
        await axios.post(`${this.restPath}/${squareId}/sqr-eval-group/${evalGroupIds.join(',')}/user/${userIds.join(',')}/colorize/${color}`, {});
    }

    async getSquareModules(squareId: SqrSquareDto['id']): Promise<SqrSquareModuleDto[]> {
        return (await axios.get<SqrSquareModuleDto[]>(`${this.restPath}/${squareId}/sqr-square-modules`)).data;
    }

    async getSquareModule(squareId: SqrSquareDto['id'], squareModuleId: SqrSquareModuleDto['id']): Promise<SqrSquareModuleDto> {
        return (await axios.get<SqrSquareModuleDto>(`${this.restPath}/${squareId}/sqr-square-modules/${squareModuleId}`)).data;
    }

    async createSquareModule(squareId: SqrSquareDto['id'], squareModule: SqrSquareModuleDto): Promise<SqrSquareModuleDto> {
        return (await axios.post<SqrSquareModuleDto>(`${this.restPath}/${squareId}/sqr-square-modules`, squareModule)).data;
    }

    async editSquareModule(squareId: SqrSquareDto['id'], squareModuleId: SqrSquareModuleDto['id'], squareModule: SqrSquareModuleDto): Promise<SqrSquareModuleDto> {
        return (await axios.put<SqrSquareModuleDto>(`${this.restPath}/${squareId}/sqr-square-modules/${squareModuleId}`, squareModule)).data;
    }

    async deleteSquareModules(squareId: SqrSquareDto['id'],
                              squareModuleIds: SqrSquareModuleDto['id'][]): Promise<void> {
        await axios.delete<void>(`${this.restPath}/${squareId}/sqr-square-modules/${squareModuleIds.join(',')}`);
    }
}
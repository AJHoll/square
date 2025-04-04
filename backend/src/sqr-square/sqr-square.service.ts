import {Injectable, StreamableFile} from '@nestjs/common';
import {DatabaseService} from '../services/database.service';
import {SqrSquareDto} from "../dtos/sqr-square.dto";
import {SqrRoleDto} from "../dtos/sqr-role.dto";
import {SqrSquareUserDto} from "../dtos/sqr-square-user.dto";
import {UserDto} from "../dtos/user.dto";
import {SqrTeamDto} from "../dtos/sqr-team.dto";
import {SqrSquareTeamUserDto} from "../dtos/sqr-square-team-user.dto";
import {SqrTimerDto} from "../dtos/sqr-timer.dto";
import {SqrTimerState, SqrTimerStateWithTitles} from "../dtos/sqr-timer-state";
import {Interval} from "@nestjs/schedule";
import {SqrSquareEvalGroupDto} from "../dtos/sqr-square-eval-group.dto";
import {SqrSquareEvalGroupUserDto} from "../dtos/sqr-square-eval-group-user.dto";
import {Workbook} from "exceljs";
import * as path from 'path';
import * as process from "process";
import {v4 as uuid} from "uuid";
import {createReadStream, unlink} from "fs";
import {SqrSquareModuleDto} from "../dtos/sqr-square-module.dto";
import {SqrCriteriaDto} from "../dtos/sqr-criteria.dto";
import {SqrAspectDto} from "../dtos/sqr-aspect.dto";

@Injectable()
export class SqrSquareService {

    constructor(private databaseService: DatabaseService) {
    }

    async getSquares(user: UserDto): Promise<SqrSquareDto[]> {
        const recs = await this.databaseService.sqr_square.findMany(
            {
                where: user.roles.includes('admin') ? undefined : {
                    sqr_square_user: {
                        some: {user_id: user.id}
                    }
                }
            }
        );
        return recs.map(rec => ({
            id: rec.id.toNumber(),
            name: rec.name,
            caption: rec.caption,
            description: rec.description,
            activeModules: rec.active_modules,
        }));
    }

    async getSquare(id: SqrSquareDto['id']): Promise<SqrSquareDto> {
        const rec = await this.databaseService.sqr_square.findFirst({where: {id}});
        return {
            id: rec.id.toNumber(),
            name: rec.name,
            caption: rec.caption,
            description: rec.description,
            activeModules: rec.active_modules,
        };
    }

    async createSquare(admRole: SqrSquareDto): Promise<SqrSquareDto> {
        const rec = await this.databaseService.sqr_square.create({
            data: {
                name: admRole.name,
                caption: admRole.caption,
                description: admRole.description,
                active_modules: admRole.activeModules,
            },
        });
        return {
            id: rec.id.toNumber(),
            name: rec.name,
            caption: rec.caption,
            description: rec.description,
            activeModules: rec.active_modules,
        };
    }

    async editSquare(id: SqrSquareDto['id'], admRole: SqrSquareDto): Promise<SqrSquareDto> {
        const rec = await this.databaseService.sqr_square.update({
            data: {
                name: admRole.name,
                caption: admRole.caption,
                description: admRole.description,
                active_modules: admRole.activeModules,
            },
            where: {id},
        });
        return {
            id: rec.id.toNumber(),
            name: rec.name,
            caption: rec.caption,
            description: rec.description,
            activeModules: rec.active_modules,
        };
    }

    async deleteSquares(ids: SqrSquareDto['id'][]): Promise<void> {
        await this.databaseService.sqr_square.deleteMany({
            where: {
                id: {in: ids}
            },
        });
    }

    async getSquareRoles(): Promise<SqrRoleDto[]> {
        const dbData = await this.databaseService.sqr_role.findMany();
        return dbData.map(d => ({
            id: d.id.toNumber(),
            name: d.name,
            caption: d.caption,
            description: d.description,
            groupId: d.group_id.toNumber(),
        }));
    }

    async getSquareRoleUsers(squareId: SqrSquareDto['id'], roleId: SqrRoleDto['id'], fastFilter: string, showAllUsers: boolean = false): Promise<SqrSquareUserDto[]> {
        const dbData = await this.databaseService.adm_user.findMany({
            include: {sqr_square_user: {where: {square_id: squareId, role_id: roleId}}},
            where: {
                name: {not: 'admin'},
                sqr_square_user: !showAllUsers ? {some: {square_id: squareId, role_id: roleId}} : undefined,
                caption: (fastFilter ?? '').length > 0 ? {contains: fastFilter, mode: "insensitive"} : undefined
            }
        });
        return dbData.map(d => ({
            id: d.id.toNumber(),
            name: d.name,
            caption: d.caption,
            activeInSquareRole: d.sqr_square_user.findIndex(su => su.user_id.toNumber() === d.id.toNumber()) !== -1,
        }));
    }

    async addUsersToSquareRole(squareId: SqrSquareDto['id'], roleIds: SqrRoleDto['id'][], userIds: SqrSquareUserDto['id'][]): Promise<void> {
        const addSquareUserData = [];
        const addAdmUserGroupData = [];
        const roles = await this.databaseService.sqr_role.findMany({where: {id: {in: roleIds}}});
        for (const role of roles) {
            for (const userId of userIds) {
                addSquareUserData.push({
                    user_id: userId,
                    role_id: role.id,
                    square_id: squareId
                });
                addAdmUserGroupData.push({
                    user_id: userId,
                    group_id: role.group_id
                });
            }
        }
        await this.databaseService.sqr_square_user.createMany({
            data: addSquareUserData
        });
        try {
            await this.databaseService.adm_user_group.createMany({
                data: addAdmUserGroupData
            });
        } catch (err) {
            console.error(err);
        }
    }

    async removeUsersFromSquareRole(squareId: SqrSquareDto['id'], roleIds: SqrRoleDto['id'][], userIds: SqrSquareUserDto['id'][]): Promise<void> {
        const groupIds = await this.databaseService.sqr_role.findMany({
            select: {group_id: true},
            distinct: 'group_id',
            where: {id: {in: roleIds}}
        });
        await this.databaseService.sqr_square_user.deleteMany({
            where: {
                user_id: {in: userIds},
                role_id: {in: roleIds},
                square_id: squareId
            }
        });
        await this.databaseService.adm_user_group.deleteMany({
            where: {
                user_id: {in: userIds},
                group_id: {in: groupIds.map(g => g.group_id)},
            }
        })
    }

    async getSquareTeams(squareId: SqrSquareDto['id']): Promise<SqrTeamDto[]> {
        const dbData = await this.databaseService.sqr_square_team.findMany({
            where: {square_id: squareId},
            orderBy: {caption: 'asc'}
        });
        const criterias = (await this.databaseService.sqr_criteria.findFirst({
            where: {
                square_id: squareId
            }
        }))?.criterias;
        return dbData.map(d => ({
            id: d.id.toNumber(),
            squareId: d.square_id.toNumber(),
            name: d.name,
            caption: d.caption,
            description: d.description,
            result: this.getTeamResult(d.rates as unknown as SqrCriteriaDto[], criterias as unknown as SqrCriteriaDto[]),
        }));
    }

    getTeamResult(rates: SqrCriteriaDto[], criterias: SqrCriteriaDto[]): number {
        return rates?.reduce((crAcc, criteria) => {
            crAcc += criteria.subcriterias?.reduce((sCrAcc, subcriteria) => {
                sCrAcc += subcriteria.aspects?.reduce((asAcc, aspect) => {
                    asAcc += this.getAspectMark(aspect, criterias);
                    return asAcc;
                }, 0) ?? 0;
                return sCrAcc;
            }, 0) ?? 0;
            return crAcc;
        }, 0) ?? 0;
    }

    getAspectMark(aspect: SqrAspectDto, criterias: SqrCriteriaDto[]): number {
        switch (aspect.type) {
            case "B": {
                return +(aspect.mark ?? '0');
            }
            case "D": {
                if (aspect.extra.findIndex(extra => extra.mark !== undefined && extra.mark !== null) === -1) {
                    return 0;
                }
                const errorPoints = aspect.extra?.reduce((exAcc, extra) => {
                    exAcc += (+(extra.maxMark ?? '0') * +(extra.mark ?? '0'));
                    return exAcc;
                }, 0) ?? 0;
                let maxCriteriaMark = 0;
                for (const crCrit of (criterias ?? [])) {
                    for (const crSubcrit of (crCrit.subcriterias ?? [])) {
                        for (const crAspect of (crSubcrit.aspects ?? [])) {
                            if (crAspect.id === aspect.id) {
                                maxCriteriaMark = +(crAspect.maxMark ?? '0');
                            }
                        }
                    }
                }
                return +(maxCriteriaMark ?? '0') - (Math.round(errorPoints * 100) / 100);
            }
            case "J": {
                const arrJudge = aspect.extra?.reduce((jAcc, extra) => {
                    const idxs = extra.mark?.split('') ?? [];
                    for (const idx of idxs) {
                        jAcc[idx] = +(extra.order ?? '0');
                    }
                    return jAcc;
                }, []) ?? [];

                const coeff = (arrJudge?.length ?? 0) === 0 ? 0 : ((arrJudge?.reduce((acc, judgeScore) => {
                    acc += judgeScore;
                    return acc;
                }) ?? 0) / ((arrJudge?.length ?? 1) * 3));

                let maxCriteriaMark = 0;
                for (const crCrit of (criterias ?? [])) {
                    for (const crSubcrit of (crCrit.subcriterias ?? [])) {
                        for (const crAspect of (crSubcrit.aspects ?? [])) {
                            if (crAspect.id === aspect.id) {
                                maxCriteriaMark = +(crAspect.maxMark ?? '0');
                            }
                        }
                    }
                }
                return Math.round(maxCriteriaMark * coeff * 100) / 100;
            }
            default: {
                return 0;
            }
        }
    }

    async getSquareTeam(squareId: SqrSquareDto['id'], teamId: SqrTeamDto['id']): Promise<SqrTeamDto> {
        const dbData = await this.databaseService.sqr_square_team.findFirst({where: {square_id: squareId, id: teamId}});
        return {
            id: dbData.id.toNumber(),
            squareId: dbData.square_id.toNumber(),
            name: dbData.name,
            caption: dbData.caption,
            description: dbData.description,
        }
    }

    async createSquareTeam(squareId: SqrSquareDto['id'], team: SqrTeamDto): Promise<SqrTeamDto> {
        const dbData = await this.databaseService.sqr_square_team.create({
            data: {
                square_id: squareId,
                name: team.name,
                caption: team.caption,
                description: team.description
            }
        })
        return {
            id: dbData.id.toNumber(),
            squareId: dbData.square_id.toNumber(),
            name: dbData.name,
            caption: dbData.caption,
            description: dbData.description,
        };
    }

    async editSquareTeam(squareId: SqrSquareDto['id'], teamId: SqrTeamDto['id'], team: SqrTeamDto): Promise<SqrTeamDto> {
        const dbData = await this.databaseService.sqr_square_team.update({
            where: {id: teamId},
            data: {
                name: team.name,
                caption: team.caption,
                description: team.description
            }
        })
        return {
            id: dbData.id.toNumber(),
            squareId: dbData.square_id.toNumber(),
            name: dbData.name,
            caption: dbData.caption,
            description: dbData.description,
        };
    }

    async deleteSquareTeams(squareId: SqrSquareDto['id'], teamIds: SqrTeamDto['id'][]): Promise<void> {
        await this.databaseService.sqr_square_team.deleteMany({where: {square_id: squareId, id: {in: teamIds}}});
    }

    async getSquareTeamUsers(squareId: SqrSquareDto['id'],
                             teamId: SqrTeamDto['id'],
                             showAllUsers: boolean,
                             fastFilter: string,
    ): Promise<SqrSquareTeamUserDto[]> {
        const dbData = await this.databaseService.sqr_square_user.findMany({
            include: {
                adm_user: true,
                sqr_square_team: true,
                sqr_role: true,
            },
            where: {
                square_id: squareId,
                sqr_role: {name: {in: ['participant', 'teamExpert']}},
                team_id: !showAllUsers ? teamId : undefined,
                adm_user: (fastFilter ?? '').length > 0 ? {
                    caption: {
                        contains: fastFilter,
                        mode: "insensitive"
                    }
                } : undefined
            },
            orderBy: {adm_user: {caption: 'asc'}}
        });
        return dbData.map(d => ({
            id: d.id.toNumber(),
            team: {
                id: d.sqr_square_team?.id.toNumber(),
                name: d.sqr_square_team?.name,
                caption: d.sqr_square_team?.caption,
                description: d.sqr_square_team?.description,
                squareId: d.sqr_square_team?.square_id.toNumber()
            },
            role: {
                id: d.sqr_role?.id.toNumber(),
                name: d.sqr_role?.name,
                caption: d.sqr_role?.caption,
                description: d.sqr_role?.description,
            },
            user: {
                id: d.adm_user.id.toNumber(),
                name: d.adm_user.name,
                caption: d.adm_user.caption,
                activeInSquareRole: d.team_id?.toNumber() === teamId
            }
        }));
    }

    async addUsersToSquareTeams(squareId: SqrSquareDto['id'], teamIds: SqrTeamDto['id'][], userIds: SqrSquareUserDto['id'][]): Promise<void> {
        await Promise.all(teamIds.map(teamId => this.databaseService.sqr_square_user.updateMany({
            where: {
                square_id: squareId,
                id: {in: userIds},
            },
            data: {team_id: teamId}
        })));
    }

    async removeUsersFromSquareTeams(squareId: SqrSquareDto['id'], teamIds: SqrTeamDto['id'][], userIds: SqrSquareUserDto['id'][]): Promise<void> {
        await this.databaseService.sqr_square_user.updateMany({
            where: {
                square_id: squareId,
                id: {in: userIds},
                team_id: {in: teamIds}
            },
            data: {team_id: null}
        });
    }

    async getSquareTimers(squareId: SqrSquareDto['id']): Promise<SqrTimerDto[]> {
        const dbData = await this.databaseService.sqr_square_timer.findMany({
            where: {square_id: squareId},
            include: {sqr_square_timer_detail: true},
            orderBy: {id: 'asc'}
        });
        return dbData.map((rec) => ({
            id: rec.id.toNumber(),
            squareId: rec.square_id.toNumber(),
            teamId: rec.team_id?.toNumber(),
            caption: rec.caption,
            state: {key: rec.state, value: SqrTimerStateWithTitles[<SqrTimerState>rec.state]},
            count: Number(rec.count),
            beginTime: rec.begin_time,
            pauseTime: rec.pause_time,
            continueTime: rec.continue_time,
            stopTime: rec.stop_time,
            countLeft: rec.state === 'STOP' ? 0 : this.calcTimerLeftTime(rec.begin_time,
                Number(rec.count),
                Number(rec.sqr_square_timer_detail.reduce((acc, detailRec) => {
                    if (detailRec.state === 'PAUSE') {
                        acc += (detailRec.count ?? BigInt(Math.floor((Date.now() - detailRec.time.getTime()) / 1000)))
                    }
                    return acc;
                }, BigInt(0))))
        }));
    }

    async getSquareTimer(squareId: SqrSquareDto['id'], timerId: SqrTimerDto['id']): Promise<SqrTimerDto> {
        const rec = await this.databaseService.sqr_square_timer.findFirst({
            where:
                {square_id: squareId, id: timerId},
            include: {sqr_square_timer_detail: true}
        });
        if (!rec) {
            return {};
        }
        return {
            id: rec.id.toNumber(),
            squareId: rec.square_id.toNumber(),
            teamId: rec.team_id?.toNumber(),
            caption: rec.caption,
            state: {key: rec.state, value: SqrTimerStateWithTitles[<SqrTimerState>rec.state]},
            count: Number(rec.count),
            beginTime: rec.begin_time,
            pauseTime: rec.pause_time,
            continueTime: rec.continue_time,
            stopTime: rec.stop_time,
            countLeft: rec.state === 'STOP' ? 0 : this.calcTimerLeftTime(rec.begin_time,
                Number(rec.count),
                Number(rec.sqr_square_timer_detail.reduce((acc, detailRec) => {
                    if (detailRec.state === 'PAUSE') {
                        acc += (detailRec.count ?? BigInt(Math.floor((Date.now() - detailRec.time.getTime()) / 1000)))
                    }
                    return acc;
                }, BigInt(0))))
        };
    }

    async recreateSquareTimer(squareId: SqrSquareDto['id'], timerId?: SqrTimerDto['id']): Promise<void> {
        await this.databaseService.$transaction(async (prisma) => {
            let timer: SqrTimerDto;
            if (timerId) {
                timer = await this.getSquareTimer(squareId, timerId);
            }
            await prisma.sqr_square_timer.deleteMany({where: {square_id: squareId, id: timerId}});
            if (timer) {
                await prisma.sqr_square_timer.create({
                    data: {
                        square_id: squareId,
                        team_id: timer.teamId,
                        caption: timer.caption,
                        sqr_square_timer_detail: {
                            create: {
                                state: 'READY',
                                time: new Date(),
                                description: 'Пересоздание таймера'
                            }
                        }
                    },
                });
            } else {
                const teams = await this.getSquareTeams(squareId);
                await prisma.sqr_square_timer.create({
                    data: {
                        square_id: squareId,
                        team_id: null as number,
                        caption: 'Основной таймер',
                        sqr_square_timer_detail: {
                            create: {
                                state: 'READY',
                                time: new Date(),
                                description: 'Пересоздание основного таймера'
                            }
                        }
                    },
                });
                for (const team of teams) {
                    await prisma.sqr_square_timer.create({
                        data: {
                            square_id: squareId,
                            team_id: team.id,
                            caption: team.caption,
                            sqr_square_timer_detail: {
                                create: {
                                    state: 'READY',
                                    time: new Date(),
                                    description: 'Пересоздание таймеров команд'
                                }
                            }
                        },
                    });
                }
            }
        });
    }

    async setTimerCount(squareId: SqrSquareDto['id'],
                        count: SqrTimerDto['count'],
                        timerId?: SqrTimerDto['id']): Promise<void> {
        await this.databaseService.sqr_square_timer.updateMany({
            where: {square_id: squareId, id: timerId},
            data: {count: count}
        });
    }

    async startTimer(squareId: SqrSquareDto['id'], timerId?: SqrTimerDto['id']): Promise<void> {
        await this.databaseService.$transaction(async (prisma) => {
            const timers = await prisma.sqr_square_timer.findMany({
                where: {
                    square_id: squareId,
                    state: {in: ['PAUSE', 'READY']},
                    id: timerId
                }
            });
            for (const timer of timers) {
                switch (timer.state) {
                    case 'READY': {
                        await prisma.sqr_square_timer.update({
                            where: {id: timer.id},
                            data: {
                                state: 'START',
                                begin_time: new Date(),
                            }
                        });
                        await prisma.sqr_square_timer_detail.create({
                            data: {
                                timer_id: timer.id,
                                state: 'START',
                                time: new Date(),
                                description: 'Запуск таймера'
                            }
                        });
                        break;
                    }
                    case 'PAUSE': {
                        await prisma.sqr_square_timer.update({
                            where: {id: timer.id},
                            data: {
                                state: 'START',
                                continue_time: new Date(),
                            }
                        });
                        const activePauseDetails = await prisma.sqr_square_timer_detail.findMany(
                            {where: {timer_id: {in: timers.map((timer) => timer.id)}, state: 'PAUSE', count: null}}
                        );
                        for (const activePauseDetail of activePauseDetails) {
                            await prisma.sqr_square_timer_detail.update({
                                where: {id: activePauseDetail.id},
                                data: {
                                    count: Math.floor(Date.now() / 1000) - Math.floor(activePauseDetail.time.getTime() / 1000)
                                }
                            })
                        }
                        await prisma.sqr_square_timer_detail.create({
                            data: {
                                timer_id: timer.id,
                                state: 'START',
                                time: new Date(),
                                description: 'Возобновление таймера'
                            }
                        });
                        break;
                    }
                }
            }
        });
    }

    async pauseTimer(squareId: SqrSquareDto['id'], description: string, timerId?: SqrTimerDto['id']): Promise<void> {
        await this.databaseService.$transaction(async (prisma) => {
            const timers = await prisma.sqr_square_timer.findMany({
                where: {
                    square_id: squareId,
                    state: {in: ['START']},
                    id: timerId
                }
            });
            await prisma.sqr_square_timer.updateMany({
                where: {
                    id: {in: timers.map(timer => timer.id)}
                },
                data: {
                    state: 'PAUSE',
                    pause_time: new Date(),
                    continue_time: null,
                },
            });
            await prisma.sqr_square_timer_detail.createMany({
                data: timers.map((timer) => ({
                    timer_id: timer.id,
                    state: 'PAUSE',
                    time: new Date(),
                    description: description ?? 'Пауза таймера'
                }))
            });
        });
    }

    async stopTimer(user: UserDto, squareId: SqrSquareDto['id'], timerId?: SqrTimerDto['id']): Promise<void> {
        await this.databaseService.$transaction(async (prisma) => {
            const timers = await prisma.sqr_square_timer.findMany({
                where: {
                    square_id: squareId,
                    state: {notIn: ['STOP']},
                    id: timerId
                }
            });
            await prisma.sqr_square_timer.updateMany({
                where: {
                    id: {in: timers.map(timer => timer.id)}
                },
                data: {
                    state: 'STOP',
                    stop_time: new Date(),
                },
            });
            await prisma.sqr_square_timer_detail.createMany({
                data: timers.map((timer) => ({
                    timer_id: timer.id,
                    state: 'STOP',
                    time: new Date(),
                    description: `Останов таймера ${user?.caption ? `пользователем ${user.caption}` : ''}`
                }))
            });
        });
    }

    calcTimerLeftTime(startDate: Date, count: number, pausedTime: number): number {
        if (!startDate) {
            return count;
        }
        const predictEndDate = startDate.valueOf() + (count + pausedTime) * 1000;
        const timeLeft = Math.floor((new Date(predictEndDate).valueOf() - new Date().valueOf()) / 1000);
        return timeLeft <= 0 ? 0 : timeLeft;
    }

    @Interval(1000)
    async syncTimers() {
        await this.databaseService.$transaction(async (prisma) => {
            const activeTimers = await prisma.sqr_square_timer.findMany({
                where: {state: 'START'},
                include: {sqr_square_timer_detail: true}
            });
            for (const rec of activeTimers) {
                const leftTime = this.calcTimerLeftTime(rec.begin_time,
                    Number(rec.count),
                    Number(rec.sqr_square_timer_detail.reduce((acc, detailRec) => {
                        if (detailRec.state === 'PAUSE') {
                            acc += (detailRec.count ?? BigInt(Math.floor((Date.now() - detailRec.time.getTime()) / 1000)))
                        }
                        return acc;
                    }, BigInt(0))));
                if (leftTime <= BigInt(0)) {
                    await prisma.sqr_square_timer.update({
                        where: {id: rec.id},
                        data: {
                            state: 'STOP',
                            stop_time: new Date(),
                        }
                    });
                    await prisma.sqr_square_timer_detail.create({
                        data: {
                            timer_id: rec.id,
                            state: 'STOP',
                            time: new Date(),
                            description: 'Таймер остановлен. Время вышло'
                        }
                    });
                }
            }
        });
    }

    async getSquareEvalGroups(squareId: SqrSquareDto['id']): Promise<SqrSquareEvalGroupDto[]> {
        const recs = await this.databaseService.sqr_square_eval_group.findMany({
            where: {square_id: squareId}
        });
        return recs.map((rec): SqrSquareEvalGroupDto => ({
            id: rec.id.toNumber(),
            squareId: rec.square_id.toNumber(),
            code: rec.code,
            caption: rec.caption,
            modules: rec.modules,
        }));
    }

    async getSquareEvalGroup(squareId: SqrSquareDto['id'],
                             evalGroupId: SqrSquareEvalGroupDto['id']): Promise<SqrSquareEvalGroupDto> {
        const rec = await this.databaseService.sqr_square_eval_group.findFirst({
            where: {square_id: squareId, id: evalGroupId}
        });
        return {
            id: rec.id.toNumber(),
            squareId: rec.square_id.toNumber(),
            code: rec.code,
            caption: rec.caption,
            modules: rec.modules,
        };
    }

    async getSquareEvalGroupUsers(squareId: SqrSquareDto['id'],
                                  evalGroupId: SqrSquareEvalGroupDto['id'],
                                  showAllUsers: boolean,
                                  fastFilter: string,
    ): Promise<SqrSquareEvalGroupUserDto[]> {
        const recs = await this.databaseService.sqr_square_user.findMany({
            include: {
                adm_user: true,
                sqr_role: true,
                sqr_square_eval_group_user: true,
            },
            where: {
                square_id: squareId,
                sqr_role: {name: {in: ['chiefExpert', 'deputyChiefExpert', 'technicalExpert', 'teamExpert', 'evaluationExpert']}},
                sqr_square_eval_group_user: !showAllUsers ? {some: {eval_group_id: evalGroupId}} : undefined,
                adm_user: (fastFilter ?? '').length > 0 ? {
                    caption: {
                        contains: fastFilter,
                        mode: "insensitive"
                    }
                } : undefined
            },
            orderBy: [{adm_user: {name: 'asc'}}, {adm_user: {id: 'asc'}}]
        });
        return recs.map((rec) => ({
            id: rec.id.toNumber(),
            name: rec.adm_user.name,
            caption: rec.adm_user.caption,
            role: {
                id: rec.sqr_role.id.toNumber(),
                name: rec.sqr_role.name,
                caption: rec.sqr_role.caption,
                description: rec.sqr_role.description,
                groupId: rec.sqr_role.group_id.toNumber()
            },
            activeInSquareRole: rec.sqr_square_eval_group_user.findIndex((groupUser) => groupUser.eval_group_id.toNumber() === evalGroupId) !== -1,
            color: rec.sqr_square_eval_group_user.find((groupUser) => groupUser.eval_group_id.toNumber() === evalGroupId)?.color,
            shortName: rec.sqr_square_eval_group_user.find((groupUser) => groupUser.eval_group_id.toNumber() === evalGroupId)?.short_name,
        }));
    }

    async createSquareEvalGroup(squareId: SqrSquareDto['id'],
                                evalGroup: SqrSquareEvalGroupDto): Promise<SqrSquareEvalGroupDto> {
        const rec = await this.databaseService.sqr_square_eval_group.create({
            data: {
                square_id: squareId,
                code: evalGroup.code,
                caption: evalGroup.caption,
                modules: evalGroup.modules,
            }
        });
        return {
            id: rec.id.toNumber(),
            squareId: rec.square_id.toNumber(),
            code: rec.code,
            caption: rec.caption
        };
    }

    async editSquareEvalGroup(squareId: SqrSquareDto['id'],
                              evalGroupId: SqrSquareEvalGroupDto['id'],
                              evalGroup: SqrSquareEvalGroupDto): Promise<SqrSquareEvalGroupDto> {
        const rec = await this.databaseService.sqr_square_eval_group.update({
            where: {square_id: squareId, id: evalGroupId},
            data: {
                square_id: squareId,
                code: evalGroup.code,
                caption: evalGroup.caption,
                modules: evalGroup.modules,
            }
        });
        return {
            id: rec.id.toNumber(),
            squareId: rec.square_id.toNumber(),
            code: rec.code,
            caption: rec.caption
        };
    }

    async deleteSquareEvalGroups(squareId: SqrSquareDto['id'], evalGroupIds: SqrSquareEvalGroupDto['id'][]): Promise<void> {
        await this.databaseService.sqr_square_eval_group.deleteMany({
            where: {square_id: squareId, id: {in: evalGroupIds}}
        });
    }

    async addUsersToEvalGroups(squareId: SqrSquareDto['id'],
                               sqrEvalGroupIds: SqrSquareEvalGroupDto['id'][],
                               userIds: SqrSquareEvalGroupUserDto['id'][]): Promise<void> {
        await this.databaseService.$transaction(async (prisma) => {
            const existsSquareEvalGroupUsers = await prisma.sqr_square_eval_group_user.findMany({
                where: {eval_group_id: {in: sqrEvalGroupIds}, user_id: {in: userIds}},
            });
            const addedUsers = await prisma.sqr_square_user.findMany({
                where: {id: {in: userIds}},
                include: {adm_user: true}
            });
            for (const sqrEvalGroupId of sqrEvalGroupIds) {
                for (const userId of userIds.map(uid => +uid)) {
                    if (existsSquareEvalGroupUsers.findIndex((groupUser) =>
                        groupUser.eval_group_id.toNumber() === sqrEvalGroupId
                        && groupUser.user_id.toNumber() === userId) === -1) {
                        const addedUser = addedUsers.find((au) => au.id.toNumber() === userId);
                        const shortName = addedUser.adm_user.caption.trim().split(' ').map(word => word.trim()[0]).join('');
                        await prisma.sqr_square_eval_group_user.create({
                            data: {
                                user_id: userId,
                                eval_group_id: sqrEvalGroupId,
                                short_name: shortName,
                            }
                        });
                    }
                }
            }
        });
    }

    async removeUsersFromEvalGroups(squareId: SqrSquareDto['id'],
                                    sqrEvalGroupIds: SqrSquareEvalGroupDto['id'][],
                                    userIds: SqrSquareEvalGroupUserDto['id'][]): Promise<void> {
        await this.databaseService.sqr_square_eval_group_user.deleteMany({
            where: {eval_group_id: {in: sqrEvalGroupIds}, user_id: {in: userIds}}
        });
    }

    async getTimerPauseReport(squareId: SqrSquareDto['id']): Promise<StreamableFile> {
        const chiefExpertCaption: string = (await this.databaseService.sqr_square_user.findFirst({
            where: {square_id: squareId, sqr_role: {name: 'chiefExpert'}},
            include: {adm_user: true}
        }))?.adm_user?.caption;
        const squareCaption = (await this.databaseService.sqr_square.findFirst({where: {id: squareId}}))?.caption;
        const timerPauses = (await this.databaseService.sqr_square_timer_detail.findMany({
            where: {sqr_square_timer: {square_id: squareId, team_id: {not: null}}, state: 'PAUSE', time: {not: null}},
            include: {sqr_square_timer: {include: {sqr_square_team: true}}},
            orderBy: [{time: 'desc'}, {sqr_square_timer: {sqr_square_team: {caption: 'desc'}}}]
        }));
        const fileName = uuid() + '.xlsx';
        const workbook = new Workbook();
        // read excel tempalte
        await workbook.xlsx.readFile(path.join(process.env.TEMPLATE_DIR, 'timer-protocol-template.xlsx'));

        const sheet = workbook.getWorksheet('Протокол остановки времени');
        let titleCell, chiefExpertCell, pausesTemplateRowNum;
        sheet.eachRow((row) => {
            row.eachCell((cell) => {
                if ((cell?.value ?? '') === '$title') {
                    titleCell = cell;
                }
                if ((cell?.value ?? '') === '$chiefExpert') {
                    chiefExpertCell = cell;
                }
                if ((cell?.value ?? '') === '$teamCaption') {
                    pausesTemplateRowNum = row.number;
                }
            });
        });
        if (titleCell) {
            titleCell.value = `Протокол учета времени компетенции "${squareCaption}"`;
        }
        if (chiefExpertCell) {
            chiefExpertCell.value = chiefExpertCaption;
        }
        if (pausesTemplateRowNum) {
            for (const timerPause of timerPauses) {
                sheet.duplicateRow(pausesTemplateRowNum, 1, true);
                const pausesRow = sheet.getRow(pausesTemplateRowNum + 1);
                pausesRow.eachCell((pauseCell) => {
                    if (pauseCell.value === '$teamCaption') {
                        pauseCell.value = timerPause.sqr_square_timer?.sqr_square_team?.caption;
                    }
                    if (pauseCell.value === '$pauseTime') {
                        pauseCell.value = timerPause.time.toLocaleString();
                    }
                    if (pauseCell.value === '$startTime') {
                        pauseCell.value = new Date(timerPause.time.setSeconds(timerPause.time.getSeconds() + Number(timerPause.count))).toLocaleString();
                    }
                    if (pauseCell.value === '$description') {
                        pauseCell.value = timerPause.description;
                    }
                });
            }
            sheet.spliceRows(pausesTemplateRowNum, 1);
        }
        const filePath = path.join(process.env.TEMPLATE_DIR, 'generated', fileName);
        await workbook.xlsx.writeFile(filePath);
        const file = createReadStream(path.join(process.env.TEMPLATE_DIR, 'generated', fileName));
        file.on('end', () => {
            unlink(filePath, () => ((error: unknown) => {
                if (error) console.error(error);
            }));
        });
        return new StreamableFile(file);
    }

    async exportSquareRoleUser(squareId: SqrSquareDto['id']): Promise<StreamableFile> {
        const fileName = uuid() + '.xlsx';
        const workbook = new Workbook();
        // read excel tempalte
        await workbook.xlsx.readFile(path.join(process.env.TEMPLATE_DIR, 'square_user_export.xlsx'));
        const sheet = workbook.getWorksheet('Пользователи на площадке');
        const records = await this.databaseService.sqr_square_user.findMany({
            where: {square_id: squareId},
            include: {sqr_role: true, adm_user: true},
            orderBy: [{sqr_role: {id: 'asc'}}, {adm_user: {caption: 'asc'}}]
        });
        let rowIdx = 2;
        for (const record of records) {
            const row = sheet.getRow(rowIdx);
            row.getCell('A').value = record.adm_user.name;
            row.getCell('B').value = record.adm_user.caption;
            row.getCell('C').value = record.sqr_role.caption;
            rowIdx++;
        }
        const filePath = path.join(process.env.TEMPLATE_DIR, 'generated', fileName);
        await workbook.xlsx.writeFile(filePath);
        const file = createReadStream(path.join(process.env.TEMPLATE_DIR, 'generated', fileName));
        file.on('end', () => {
            unlink(filePath, () => ((error: unknown) => {
                if (error) console.error(error);
            }));
        });
        return new StreamableFile(file);
    }

    async colorizeSquareEvalGroupUsers(squareId: SqrSquareDto['id'],
                                       sqrEvalGroupIds: SqrSquareEvalGroupDto['id'][],
                                       userIds: SqrSquareEvalGroupUserDto['id'][],
                                       color: SqrSquareEvalGroupUserDto['color']): Promise<void> {
        await this.databaseService.sqr_square_eval_group_user.updateMany({
            where: {
                user_id: {in: userIds},
                eval_group_id: {in: sqrEvalGroupIds},
            },
            data: {
                color: color
            }
        });
    }

    async getSquareModules(squareId: SqrSquareDto['id']): Promise<SqrSquareModuleDto[]> {
        const recs = await this.databaseService.sqr_square_module.findMany({
            where: {square_id: squareId}
        });
        return recs.map(rec => ({
            id: rec.id.toNumber(),
            squareId: rec.square_id.toNumber(),
            code: rec.code,
            caption: rec.caption,
            evaluating: rec.evaluating,
        }));
    }

    async getSquareModule(squareId: SqrSquareDto['id'], moduleId: SqrSquareModuleDto['id']): Promise<SqrSquareModuleDto> {
        const rec = await this.databaseService.sqr_square_module.findFirst({
            where: {square_id: squareId, id: moduleId},
        });
        return {
            id: rec.id.toNumber(),
            squareId: rec.square_id.toNumber(),
            code: rec.code,
            caption: rec.caption,
            evaluating: rec.evaluating,
        };
    }

    async createSquareModule(squareId: SqrSquareDto['id'], module: SqrSquareModuleDto): Promise<SqrSquareModuleDto> {
        const rec = await this.databaseService.sqr_square_module.create({
            data: {
                square_id: squareId,
                code: module.code,
                caption: module.caption,
                evaluating: module.evaluating
            }
        })
        return {
            id: rec.id.toNumber(),
            squareId: rec.square_id.toNumber(),
            code: rec.code,
            caption: rec.caption,
            evaluating: rec.evaluating,
        };
    }

    async editSquareModule(squareId: SqrSquareDto['id'], moduleId: SqrSquareModuleDto['id'], module: SqrSquareModuleDto): Promise<SqrSquareModuleDto> {
        const rec = await this.databaseService.sqr_square_module.update({
            where: {square_id: squareId, id: moduleId},
            data: {
                code: module.code,
                caption: module.caption,
                evaluating: module.evaluating
            }
        })
        return {
            id: rec.id.toNumber(),
            squareId: rec.square_id.toNumber(),
            code: rec.code,
            caption: rec.caption,
            evaluating: rec.evaluating,
        };
    }

    async deleteSquareModules(squareId: SqrSquareDto['id'], moduleIds: SqrSquareModuleDto['id'][]): Promise<void> {
        await this.databaseService.sqr_square_module.deleteMany({where: {square_id: squareId, id: {in: moduleIds}}});
    }
}
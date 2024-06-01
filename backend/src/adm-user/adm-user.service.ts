import {Injectable, StreamableFile} from '@nestjs/common';
import {AdmUserDto} from "../dtos/adm-user.dto";
import {DatabaseService} from "../services/database.service";
import * as bcrypt from "bcrypt";
import * as process from 'process';
import {AdmUserGroupDto} from "../dtos/adm-user-group.dto";
import {AdmGroupDto} from "../dtos/adm-group.dto";
import * as path from "path";
import {createReadStream} from "fs";
import {Workbook} from "exceljs";
import {SqrTimerDto} from "../dtos/sqr-timer.dto";
import {SqrTimerState, SqrTimerStateWithTitles} from "../dtos/sqr-timer-state";
import {SqrSquareService} from "../sqr-square/sqr-square.service";

@Injectable()
export class AdmUserService {
    constructor(private databaseService: DatabaseService,
                private sqrSquareService: SqrSquareService) {
    }

    async getUsers(): Promise<AdmUserDto[]> {
        const dbResult = await this.databaseService.adm_user.findMany();
        return dbResult.map((res) => ({
            id: res.id.toNumber(),
            name: res.name,
            caption: res.caption
        }))
    }

    async getUser(id: AdmUserDto['id']): Promise<AdmUserDto> {
        const dbData = await this.databaseService.adm_user.findFirst({where: {id}});
        return {
            id: dbData.id.toNumber(),
            name: dbData.name,
            caption: dbData.caption,
        };
    }

    async createUser(admUser: AdmUserDto): Promise<AdmUserDto> {
        const hash = await bcrypt.hash(admUser.password, (+process.env.USER_PASSWORD_SALT_LEN ?? 0));
        const dbResult = await this.databaseService.adm_user.create({
            data: {
                name: admUser.name,
                caption: admUser.caption,
                hash
            },
        });
        return {
            id: dbResult.id.toNumber(),
            name: dbResult.name,
            caption: dbResult.caption,
        };
    }

    async editUser(id: AdmUserDto['id'], admUser: AdmUserDto, myUser?: boolean): Promise<AdmUserDto> {
        let hash: string;
        if (admUser.password) {
            hash = await bcrypt.hash(admUser.password, (+process.env.USER_PASSWORD_SALT_LEN ?? 0));
        }
        const dbResult = await this.databaseService.adm_user.update({
            data: {
                name: admUser.name,
                caption: admUser.caption,
                hash
            },
            where: {id, AND: !myUser ? {name: {not: {equals: 'admin'}}} : undefined},
        });
        return {
            id: dbResult.id.toNumber(),
            name: dbResult.name,
            caption: dbResult.caption,
        };
    }

    async deleteUsers(ids: AdmUserDto['id'][]): Promise<void> {
        await this.databaseService.adm_user.deleteMany({
            where: {
                id: {in: ids},
                AND: {
                    name: {not: {equals: 'admin'}},
                },
            },
        });
    }

    async getUserGroups(id: AdmUserDto['id']): Promise<AdmUserGroupDto[]> {
        const dbResult = await this.databaseService.adm_user_group.findMany({
            include: {
                adm_user: true,
                adm_group: true,
            },
            where: {user_id: id},
        })
        return dbResult.map((res) => ({
            id: res.id.toNumber(),
            user: {
                id: res.adm_user.id.toNumber(),
                name: res.adm_user.name,
                caption: res.adm_user.caption,
            },
            group: {
                id: res.adm_group.id.toNumber(),
                name: res.adm_group.name,
                caption: res.adm_group.caption,
                description: res.adm_group.description,
            },
        }));
    }

    async addGroupsToUser(idUser: AdmUserDto['id'], groupIds: AdmGroupDto['id'][]): Promise<void> {
        await this.databaseService.adm_user_group.createMany({
            skipDuplicates: true,
            data: groupIds.map(groupId => ({
                user_id: idUser,
                group_id: groupId,
            })),
        });
    }

    async removeGroupsFromUser(idUser: AdmUserDto['id'], userGroupIds: AdmUserGroupDto['id'][]): Promise<void> {
        await this.databaseService.adm_user_group.deleteMany({
            where: {user_id: idUser, id: {in: userGroupIds}},
        });
    }

    async downloadImportTemplate(): Promise<StreamableFile> {
        const file = createReadStream(path.join(process.env.TEMPLATE_DIR, 'user_import_template.xlsx'));
        return new StreamableFile(file);
    }

    async importUsers(file: Express.Multer.File): Promise<void> {
        const userDtoList: AdmUserDto[] = [];
        if (file) {
            const workbook = new Workbook();
            await workbook.xlsx.load(file.buffer);
            const sheet = workbook.getWorksheet(1);
            sheet.eachRow((row) => {
                if (row.number !== 1) {
                    userDtoList.push({
                        name: row.getCell('A').text.toLowerCase(),
                        caption: row.getCell('B').text,
                        password: row.getCell('C').text,
                    })
                }
            });
            userDtoList.forEach((userDto) => {
                if (userDto.caption && !userDto.name) {
                    userDto.name = userDto.caption.replace(/([А-ЯЁа-яё]+)\s+([А-ЯЁа-яё]).+\s+([А-ЯЁа-яё]).+/, '$2$3$1').toLowerCase();
                    userDto.name = this.translit(userDto.name);
                }
            });
            const existedUsers = await this.databaseService.adm_user.findMany({
                where: {name: {in: userDtoList.map((userDto) => userDto.name)}}
            });
            for (const userDto1 of userDtoList.filter((userDto) => !existedUsers.map((dbUsers) => dbUsers.name).includes(userDto.name))) {
                await this.createUser(userDto1);
            }
        } else {
            throw Error('Файл не задан!');
        }
    }

    translit(word): string {
        let answer = '';
        const converter = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
            'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
            'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
            'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
            'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
            'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
            'э': 'e', 'ю': 'yu', 'я': 'ya',

            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
            'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
            'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
            'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
            'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch',
            'Ш': 'Sh', 'Щ': 'Sch', 'Ь': '', 'Ы': 'Y', 'Ъ': '',
            'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
        };
        for (let i = 0; i < word.length; ++i) {
            if (converter[word[i]] == undefined) {
                answer += word[i];
            } else {
                answer += converter[word[i]];
            }
        }
        return answer;
    }

    async getMyTimer(admUserId: AdmUserDto['id']): Promise<SqrTimerDto> {
        const rec = await this.databaseService.sqr_square_timer.findFirst({
            where: {sqr_square_team: {sqr_square_user: {some: {user_id: admUserId}}}},
            include: {sqr_square_timer_detail: true}
        });
        if (rec) {
            return {
                id: rec.id.toNumber(),
                squareId: rec.square_id.toNumber(),
                teamId: rec.team_id.toNumber(),
                caption: rec.caption,
                state: {key: rec.state, value: SqrTimerStateWithTitles[<SqrTimerState>rec.state]},
                count: Number(rec.count),
                beginTime: rec.begin_time,
                pauseTime: rec.pause_time,
                continueTime: rec.continue_time,
                stopTime: rec.stop_time,
                countLeft: this.sqrSquareService.calcTimerLeftTime(rec.begin_time,
                    Number(rec.count),
                    Number(rec.sqr_square_timer_detail.reduce((acc, detailRec) => {
                        if (detailRec.state === 'PAUSE') {
                            acc += (detailRec.count ?? BigInt(Math.floor((Date.now() - detailRec.time.getTime()) / 1000)))
                        }
                        return acc;
                    }, BigInt(0))))
            };
        }
        return null;
    }
}

import {Injectable} from '@nestjs/common';
import {AdmUserDto} from "../dtos/adm-user.dto";
import {DatabaseService} from "../services/database.service";
import * as bcrypt from "bcrypt";
import * as process from 'process';
import {AdmUserGroupDto} from "../dtos/adm-user-group.dto";
import {AdmGroupDto} from "../dtos/adm-group.dto";

@Injectable()
export class AdmUserService {
    constructor(private databaseService: DatabaseService) {
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

    async editUser(id: AdmUserDto['id'], admGroup: AdmUserDto): Promise<AdmUserDto> {
        const dbResult = await this.databaseService.adm_user.update({
            data: {
                name: admGroup.name,
                caption: admGroup.caption,
            },
            where: {id, AND: {name: {not: {equals: 'admin'}}}},
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
}

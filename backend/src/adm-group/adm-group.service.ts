import {Injectable} from '@nestjs/common';
import {AdmGroupDto} from '../dtos/adm-group.dto';
import {DatabaseService} from '../services/database.service';
import {AdmGroupRoleDto} from '../dtos/adm-group-role.dto';
import {AdmRoleDto} from '../dtos/adm-role.dto';
import {AdmUserDto} from "../dtos/adm-user.dto";

@Injectable()
export class AdmGroupService {

    constructor(private databaseService: DatabaseService) {
    }

    async getGroups(): Promise<AdmGroupDto[]> {
        const dbData = await this.databaseService.adm_group.findMany();
        return dbData.map<AdmGroupDto>(d => ({
            id: d.id.toNumber(),
            name: d.name,
            caption: d.caption,
            description: d.description,
        }));
    }

    async getGroup(id: AdmGroupDto['id']): Promise<AdmGroupDto> {
        const dbData = await this.databaseService.adm_group.findFirst({where: {id}});
        return {
            id: dbData.id.toNumber(),
            name: dbData.name,
            caption: dbData.caption,
            description: dbData.description,
        };
    }

    async createGroup(admGroup: AdmGroupDto): Promise<AdmGroupDto> {
        const dbResult = await this.databaseService.adm_group.create({
            data: {
                name: admGroup.name,
                caption: admGroup.caption,
                description: admGroup.description,
            },
        });
        return {
            id: dbResult.id.toNumber(),
            name: dbResult.name,
            caption: dbResult.caption,
            description: dbResult.description,
        };
    }

    async editGroup(id: AdmGroupDto['id'], admGroup: AdmGroupDto): Promise<AdmGroupDto> {
        const dbResult = await this.databaseService.adm_group.update({
            data: {
                name: admGroup.name,
                caption: admGroup.caption,
                description: admGroup.description,
            },
            where: {id, AND: {name: {not: {equals: 'admin'}}}},
        });
        return {
            id: dbResult.id.toNumber(),
            name: dbResult.name,
            caption: dbResult.caption,
            description: dbResult.description,
        };
    }

    async deleteGroups(ids: AdmGroupDto['id'][]): Promise<void> {
        await this.databaseService.adm_group.deleteMany({
            where: {
                id: {in: ids},
                AND: {
                    name: {not: {equals: 'admin'}},
                },
            },
        });
    }

    async getGroupRoles(id: AdmGroupDto['id']): Promise<AdmGroupRoleDto[]> {
        const dbResult = await this.databaseService.adm_group_role.findMany({
            include: {
                adm_group: true,
                adm_role: true,
            },
            where: {group_id: id},
        })
        return dbResult.map((res) => ({
            id: res.id.toNumber(),
            role: {
                id: res.adm_role.id.toNumber(),
                name: res.adm_role.name,
                caption: res.adm_role.caption,
                description: res.adm_role.description,
            },
            group: {
                id: res.adm_group.id.toNumber(),
                name: res.adm_group.name,
                caption: res.adm_group.caption,
                description: res.adm_group.description,
            },
        }));
    }

    async addRolesToGroup(id: AdmGroupDto['id'], roleIds: AdmRoleDto['id'][]): Promise<void> {
        await this.databaseService.adm_group_role.createMany({
            skipDuplicates: true,
            data: roleIds.map(roleId => ({
                group_id: id,
                role_id: roleId,
            })),
        });
    }

    async removeRolesFromGroup(id: AdmGroupDto['id'], groupRoleIds: AdmGroupRoleDto['id'][]): Promise<void> {
        await this.databaseService.adm_group_role.deleteMany({
            where: {group_id: id, id: {in: groupRoleIds}},
        });
    }

    async getGroupsExcludeUser(idUser: AdmUserDto['id']): Promise<AdmGroupDto[]> {
        const dbResult = await this.databaseService.adm_group.findMany({
            where: {NOT: {adm_user_group: {some: {user_id: idUser}}}},
        })
        return dbResult.map((res) => ({
            id: res.id.toNumber(),
            name: res.name,
            caption: res.caption,
            description: res.description,
        }));
    }
}

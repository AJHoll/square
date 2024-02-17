import {Injectable} from '@nestjs/common';
import {DatabaseService} from '../services/database.service';
import {SqrRoleDto} from "../dtos/sqr-role.dto";
import {AdmGroupService} from "../adm-group/adm-group.service";

@Injectable()
export class SqrRoleService {

    constructor(private databaseService: DatabaseService,
                private admGroupService: AdmGroupService) {
    }

    async getRoles(): Promise<SqrRoleDto[]> {
        const dbData = await this.databaseService.sqr_role.findMany();
        return dbData.map<SqrRoleDto>(d => ({
            id: d.id.toNumber(),
            name: d.name,
            caption: d.caption,
            description: d.description,
            groupId: d.group_id.toNumber(),
        }));
    }

    async getRole(id: SqrRoleDto['id']): Promise<SqrRoleDto> {
        const dbData = await this.databaseService.sqr_role.findFirst({where: {id}});
        return {
            id: dbData.id.toNumber(),
            name: dbData.name,
            caption: dbData.caption,
            description: dbData.description,
            groupId: dbData.group_id.toNumber(),
        };
    }

    async createRole(admRole: SqrRoleDto): Promise<SqrRoleDto> {
        const admGroup = await this.admGroupService.createGroup({
            name: admRole.name,
            caption: admRole.caption,
            description: admRole.description,
        });
        const dbResult = await this.databaseService.sqr_role.create({
            data: {
                name: admRole.name,
                caption: admRole.caption,
                description: admRole.description,
                group_id: admGroup.id
            },
        });
        return {
            id: dbResult.id.toNumber(),
            name: dbResult.name,
            caption: dbResult.caption,
            description: dbResult.description,
            groupId: dbResult.group_id.toNumber(),
        };
    }

    async editRole(id: SqrRoleDto['id'], admRole: SqrRoleDto): Promise<SqrRoleDto> {
        const dbResult = await this.databaseService.sqr_role.update({
            data: {
                name: admRole.name,
                caption: admRole.caption,
                description: admRole.description,
            },
            where: {id},
        });
        await this.admGroupService.editGroup(dbResult.group_id.toNumber(), {
            name: dbResult.name,
            caption: dbResult.caption,
            description: dbResult.description,
        });
        return {
            id: dbResult.id.toNumber(),
            name: dbResult.name,
            caption: dbResult.caption,
            description: dbResult.description,
            groupId: dbResult.group_id.toNumber(),
        };
    }

    async deleteRoles(ids: SqrRoleDto['id'][]): Promise<void> {
        const dbData = await this.databaseService.sqr_role.findMany({where: {id: {in: ids}}});
        await this.databaseService.sqr_role.deleteMany({
            where: {
                id: {in: ids}
            },
        });
        await this.admGroupService.deleteGroups(dbData.map(data => data.group_id.toNumber()));
    }
}

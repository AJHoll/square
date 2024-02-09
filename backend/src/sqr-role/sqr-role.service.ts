import {Injectable} from '@nestjs/common';
import {DatabaseService} from '../services/database.service';
import {SqrRoleDto} from "../dtos/sqr-role.dto";

@Injectable()
export class SqrRoleService {

    constructor(private databaseService: DatabaseService) {
    }

    async getRoles(): Promise<SqrRoleDto[]> {
        const dbData = await this.databaseService.sqr_role.findMany();
        return dbData.map<SqrRoleDto>(d => ({
            id: d.id.toNumber(),
            name: d.name,
            caption: d.caption,
            description: d.description,
        }));
    }

    async getRole(id: SqrRoleDto['id']): Promise<SqrRoleDto> {
        const dbData = await this.databaseService.sqr_role.findFirst({where: {id}});
        return {
            id: dbData.id.toNumber(),
            name: dbData.name,
            caption: dbData.caption,
            description: dbData.description,
        };
    }

    async createRole(admRole: SqrRoleDto): Promise<SqrRoleDto> {
        const dbResult = await this.databaseService.sqr_role.create({
            data: {
                name: admRole.name,
                caption: admRole.caption,
                description: admRole.description,
            },
        });
        return {
            id: dbResult.id.toNumber(),
            name: dbResult.name,
            caption: dbResult.caption,
            description: dbResult.description,
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
        return {
            id: dbResult.id.toNumber(),
            name: dbResult.name,
            caption: dbResult.caption,
            description: dbResult.description,
        };
    }

    async deleteRoles(ids: SqrRoleDto['id'][]): Promise<void> {
        await this.databaseService.sqr_role.deleteMany({
            where: {
                id: {in: ids}
            },
        });
    }
}

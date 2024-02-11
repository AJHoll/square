import {Injectable} from '@nestjs/common';
import {DatabaseService} from '../services/database.service';
import {SqrSquareDto} from "../dtos/sqr-square.dto";

@Injectable()
export class SqrSquareService {

    constructor(private databaseService: DatabaseService) {
    }

    async getRoles(): Promise<SqrSquareDto[]> {
        const dbData = await this.databaseService.sqr_square.findMany();
        return dbData.map<SqrSquareDto>(d => ({
            id: d.id.toNumber(),
            name: d.name,
            caption: d.caption,
            description: d.description,
        }));
    }

    async getRole(id: SqrSquareDto['id']): Promise<SqrSquareDto> {
        const dbData = await this.databaseService.sqr_square.findFirst({where: {id}});
        return {
            id: dbData.id.toNumber(),
            name: dbData.name,
            caption: dbData.caption,
            description: dbData.description,
        };
    }

    async createRole(admRole: SqrSquareDto): Promise<SqrSquareDto> {
        const dbResult = await this.databaseService.sqr_square.create({
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

    async editRole(id: SqrSquareDto['id'], admRole: SqrSquareDto): Promise<SqrSquareDto> {
        const dbResult = await this.databaseService.sqr_square.update({
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

    async deleteRoles(ids: SqrSquareDto['id'][]): Promise<void> {
        await this.databaseService.sqr_square.deleteMany({
            where: {
                id: {in: ids}
            },
        });
    }
}

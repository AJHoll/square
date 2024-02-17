import {Injectable} from '@nestjs/common';
import {DatabaseService} from '../services/database.service';
import {SqrSquareDto} from "../dtos/sqr-square.dto";
import {SqrRoleDto} from "../dtos/sqr-role.dto";
import {SqrSquareUserDto} from "../dtos/sqr-square-user.dto";
import {UserDto} from "../dtos/user.dto";

@Injectable()
export class SqrSquareService {

    constructor(private databaseService: DatabaseService) {
    }

    async getSquares(user: UserDto): Promise<SqrSquareDto[]> {
        const dbData = await this.databaseService.sqr_square.findMany(
            {
                where: user.roles.includes('admin') ? undefined : {
                    sqr_square_user: {
                        some: {user_id: user.id}
                    }
                }
            }
        );
        return dbData.map<SqrSquareDto>(d => ({
            id: d.id.toNumber(),
            name: d.name,
            caption: d.caption,
            description: d.description,
        }));
    }

    async getSquare(id: SqrSquareDto['id']): Promise<SqrSquareDto> {
        const dbData = await this.databaseService.sqr_square.findFirst({where: {id}});
        return {
            id: dbData.id.toNumber(),
            name: dbData.name,
            caption: dbData.caption,
            description: dbData.description,
        };
    }

    async createSquare(admRole: SqrSquareDto): Promise<SqrSquareDto> {
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

    async editSquare(id: SqrSquareDto['id'], admRole: SqrSquareDto): Promise<SqrSquareDto> {
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

    async deleteSquares(ids: SqrSquareDto['id'][]): Promise<void> {
        await this.databaseService.sqr_square.deleteMany({
            where: {
                id: {in: ids}
            },
        });
    }

    async getSquareRoles(squareId: SqrSquareDto['id']): Promise<SqrRoleDto[]> {
        const dbData = await this.databaseService.sqr_role.findMany();
        return dbData.map<SqrRoleDto>(d => ({
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
        return dbData.map<SqrSquareUserDto>(d => ({
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
        await this.databaseService.adm_user_group.createMany({
            data: addAdmUserGroupData
        });
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
}

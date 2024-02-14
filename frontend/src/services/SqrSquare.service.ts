import RootService from "./Root.service";
import {makeAutoObservable} from "mobx";
import axios from "axios";
import {SqrSquareDto} from "../dtos/SqrSquare.dto";
import {SqrRoleDto} from "../dtos/SqrRole.dto";
import {SqrSquareUserDto} from "../dtos/SqrSquareUser.dto";
import {UFilterItem} from "../components/DevsGrid/DevsGridFilterItem";

export default class SqrSquareService {
    private readonly _rootService: RootService;
    private readonly _restPath: string;

    constructor(rootService: RootService) {
        this._rootService = rootService;
        this._restPath = `${rootService.restUrl}/sqr-square`;
        makeAutoObservable(this);
    }

    async getSquares(): Promise<SqrSquareDto[]> {
        return (await axios.get<SqrSquareDto[]>(`${this._restPath}`)).data;
    }

    async getSquare(id: SqrSquareDto['id']): Promise<SqrSquareDto> {
        return (await axios.get<SqrSquareDto>(`${this._restPath}/${id}`)).data;
    }

    async createSquare(sqrSquare: SqrSquareDto): Promise<SqrSquareDto> {
        return (await axios.post<SqrSquareDto>(`${this._restPath}`, sqrSquare)).data;
    }

    async editSquare(id: SqrSquareDto['id'], sqrSquare: SqrSquareDto): Promise<SqrSquareDto> {
        return (await axios.put<SqrSquareDto>(`${this._restPath}/${id}`, sqrSquare)).data;
    }

    async deleteSquares(ids: SqrSquareDto['id'][]): Promise<void> {
        await axios.delete(`${this._restPath}/${ids.join(',')}`);
    }

    async getSquareRoles(squareId: SqrSquareDto['id']): Promise<SqrRoleDto[]> {
        if (!squareId) {
            return [];
        }
        return (await axios.get<SqrRoleDto[]>(`${this._restPath}/${squareId}/sqr-role`)).data;
    }

    async getSquareRoleUsers(squareId: SqrSquareDto['id'], roleId: SqrRoleDto['id'], filters: {
        [p: string]: UFilterItem
    }, showAllUsers: boolean): Promise<SqrSquareUserDto[]> {
        if (!squareId || !roleId) {
            return [];
        }
        return (await axios.get<SqrSquareUserDto[]>(`${this._restPath}/${squareId}/sqr-role/${roleId}/user`, {
            params: {
                showAllUsers,
                fastFilter: filters['fast_filter']?.value !== undefined && filters['fast_filter']?.value !== '' ? filters['fast_filter'].value : undefined
            }
        })).data;
    }

    async addUsersToSquareRole(squareId: SqrSquareDto['id'],
                               userIds: SqrSquareUserDto['id'][],
                               roleIds: SqrRoleDto['id'][]): Promise<void> {
        await axios.post(`${this._restPath}/${squareId}/sqr-role/${roleIds.join(',')}/user/${userIds.join(',')}`, {});
    }

    async removeUsersFromSquareRole(squareId: SqrSquareDto['id'],
                                    userIds: SqrSquareUserDto['id'][],
                                    roleIds: SqrRoleDto['id'][]): Promise<void> {
        await axios.delete(`${this._restPath}/${squareId}/sqr-role/${roleIds.join(',')}/user/${userIds.join(',')}`, {});
    }
}
import RootService from './Root.service';
import {makeAutoObservable} from 'mobx';
import {AdmGroupDto} from '../dtos/AdmGroup.dto';
import axios from 'axios';
import {AdmRoleMenuDto} from '../dtos/AdmRoleMenu.dto';
import {AdmGroupRoleDto} from '../dtos/AdmGroupRole.dto';
import {AdmRoleDto} from '../dtos/AdmRole.dto';
import {AdmUserDto} from "../dtos/AdmUser.dto";

export default class AdmGroupService {
    private readonly _rootService: RootService;

    get restPath(): string {
        return `${this._rootService.restUrl}/adm-group`;
    }

    constructor(rootService: RootService) {
        this._rootService = rootService;
        makeAutoObservable(this);
    }

    async getGroups(): Promise<AdmGroupDto[]> {
        return (await axios.get<AdmGroupDto[]>(`${this.restPath}`)).data;
    }

    async getGroupsExcludeUser(userId: AdmUserDto['id']): Promise<AdmGroupDto[]> {
        return (await axios.get<AdmGroupDto[]>(`${this.restPath}/exclude-user/${userId}`)).data;
    }

    async getGroup(id: AdmGroupDto['id']): Promise<AdmGroupDto> {
        return (await axios.get<AdmGroupDto>(`${this.restPath}/${id}`)).data;
    }

    async createGroup(admRole: AdmGroupDto): Promise<AdmGroupDto> {
        return (await axios.post<AdmGroupDto>(`${this.restPath}`, admRole)).data;
    }

    async editGroup(id: AdmGroupDto['id'], admRole: AdmGroupDto): Promise<AdmGroupDto> {
        return (await axios.put<AdmGroupDto>(`${this.restPath}/${id}`, admRole)).data;
    }

    async deleteGroups(ids: AdmGroupDto['id'][]): Promise<void> {
        await axios.delete(`${this.restPath}/${ids.join(',')}`);
    }

    async getGroupRoles(groupId: AdmGroupDto['id']): Promise<AdmGroupRoleDto[]> {
        return (await axios.get<AdmRoleMenuDto[]>(`${this.restPath}/${groupId}/role/`)).data;
    }

    async addRolesToGroup(groupId: AdmGroupDto['id'], roles: AdmRoleDto[]): Promise<void> {
        await axios.post<void>(`${this.restPath}/${groupId}/role/${roles.map(r => r.id).join(',')}`);
    }

    async remoeRolesFromGroup(groupId: AdmGroupDto['id'], roles: AdmGroupRoleDto[]): Promise<void> {
        await axios.delete<void>(`${this.restPath}/${groupId}/role/${roles.map(r => r.id).join(',')}`);
    }
}
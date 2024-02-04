import RootService from "./Root.service";
import {makeAutoObservable} from "mobx";
import {AdmUserDto} from "../dtos/AdmUser.dto";
import axios from "axios";
import {AdmGroupDto} from "../dtos/AdmGroup.dto";
import {AdmUserGroupDto} from "../dtos/AdmUserGroup.dto";

export default class AdmUserService {
    private readonly _rootService: RootService;
    private readonly _restPath: string;

    constructor(rootService: RootService) {
        this._rootService = rootService;
        this._restPath = `${rootService.restUrl}/adm-user`;
        makeAutoObservable(this);
    }

    async getUsers(): Promise<AdmUserDto[]> {
        return (await axios.get<AdmUserDto[]>(`${this._restPath}`)).data;
    }

    async getUser(id: AdmUserDto['id']): Promise<AdmUserDto> {
        return (await axios.get<AdmUserDto>(`${this._restPath}/${id}`)).data;
    }

    async createUser(admRole: AdmUserDto): Promise<AdmUserDto> {
        return (await axios.post<AdmUserDto>(`${this._restPath}`, admRole)).data;
    }

    async editUser(id: AdmUserDto['id'], admRole: AdmUserDto): Promise<AdmUserDto> {
        return (await axios.put<AdmUserDto>(`${this._restPath}/${id}`, admRole)).data;
    }

    async deleteUsers(ids: AdmUserDto['id'][]): Promise<void> {
        await axios.delete(`${this._restPath}/${ids.join(',')}`);
    }

    async getUserGroups(userId: AdmUserDto['id']): Promise<AdmUserGroupDto[]> {
        return (await axios.get<AdmUserGroupDto[]>(`${this._restPath}/${userId}/group/`)).data;
    }

    async addGroupsToUser(userId: AdmUserDto['id'], groups: AdmGroupDto[]): Promise<void> {
        await axios.post<void>(`${this._restPath}/${userId}/group/${groups.map(r => r.id).join(',')}`);
    }

    async removeGroupsFromUser(userId: AdmGroupDto['id'], groups: AdmUserGroupDto[]): Promise<void> {
        console.log(groups);
        await axios.delete<void>(`${this._restPath}/${userId}/group/${groups.map(u => u.id).join(',')}`);
    }
}
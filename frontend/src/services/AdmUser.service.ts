import RootService from "./Root.service";
import {makeAutoObservable} from "mobx";
import {AdmUserDto} from "../dtos/AdmUser.dto";
import axios from "axios";
import {AdmGroupDto} from "../dtos/AdmGroup.dto";
import {AdmUserGroupDto} from "../dtos/AdmUserGroup.dto";
import {SqrCriteriaDto} from "../dtos/SqrCriteria.dto";

export default class AdmUserService {
    private readonly _rootService: RootService;

    get restPath(): string {
        return `${this._rootService.restUrl}/adm-user`;
    }

    constructor(rootService: RootService) {
        this._rootService = rootService;
        makeAutoObservable(this);
    }

    async getUsers(): Promise<AdmUserDto[]> {
        return (await axios.get<AdmUserDto[]>(`${this.restPath}`)).data;
    }

    async getUser(id: AdmUserDto['id']): Promise<AdmUserDto> {
        return (await axios.get<AdmUserDto>(`${this.restPath}/${id}`)).data;
    }

    async createUser(admRole: AdmUserDto): Promise<AdmUserDto> {
        return (await axios.post<AdmUserDto>(`${this.restPath}`, admRole)).data;
    }

    async editUser(id: AdmUserDto['id'], admRole: AdmUserDto): Promise<AdmUserDto> {
        return (await axios.put<AdmUserDto>(`${this.restPath}/${id}`, admRole)).data;
    }

    async deleteUsers(ids: AdmUserDto['id'][]): Promise<void> {
        await axios.delete(`${this.restPath}/${ids.join(',')}`);
    }

    async getUserGroups(userId: AdmUserDto['id']): Promise<AdmUserGroupDto[]> {
        return (await axios.get<AdmUserGroupDto[]>(`${this.restPath}/${userId}/group/`)).data;
    }

    async addGroupsToUser(userId: AdmUserDto['id'], groups: AdmGroupDto[]): Promise<void> {
        await axios.post<void>(`${this.restPath}/${userId}/group/${groups.map(r => r.id).join(',')}`);
    }

    async removeGroupsFromUser(userId: AdmGroupDto['id'], groups: AdmUserGroupDto[]): Promise<void> {
        await axios.delete<void>(`${this.restPath}/${userId}/group/${groups.map(u => u.id).join(',')}`);
    }

    async downloadImportTemplate(): Promise<ArrayBuffer> {
        return (await axios.post<ArrayBuffer>(`${this.restPath}/download-import-template`, {}, {
            responseType: 'arraybuffer'
        }))?.data;
    }

    async importUser(file: File): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);
        await axios.post<SqrCriteriaDto[]>(`${this.restPath}/import-users`, formData)
    }
}
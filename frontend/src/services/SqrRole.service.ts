import RootService from "./Root.service";
import {makeAutoObservable} from "mobx";
import {SqrRoleDto} from "../dtos/SqrRole.dto";
import axios from "axios";

export default class SqrRoleService {
    private readonly _rootService: RootService;

    get restPath(): string {
        return `${this._rootService.restUrl}/sqr-role`;
    }

    constructor(rootService: RootService) {
        this._rootService = rootService;
        makeAutoObservable(this);
    }

    async getRoles(): Promise<SqrRoleDto[]> {
        return (await axios.get<SqrRoleDto[]>(`${this.restPath}`)).data;
    }

    async getRole(id: SqrRoleDto['id']): Promise<SqrRoleDto> {
        return (await axios.get<SqrRoleDto>(`${this.restPath}/${id}`)).data;
    }

    async createRole(admRole: SqrRoleDto): Promise<SqrRoleDto> {
        return (await axios.post<SqrRoleDto>(`${this.restPath}`, admRole)).data;
    }

    async editRole(id: SqrRoleDto['id'], admRole: SqrRoleDto): Promise<SqrRoleDto> {
        return (await axios.put<SqrRoleDto>(`${this.restPath}/${id}`, admRole)).data;
    }

    async deleteRoles(ids: SqrRoleDto['id'][]): Promise<void> {
        await axios.delete(`${this.restPath}/${ids.join(',')}`);
    }
}

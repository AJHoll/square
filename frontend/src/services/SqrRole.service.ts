import RootService from "./Root.service";
import {makeAutoObservable} from "mobx";
import {SqrRoleDto} from "../dtos/SqrRole.dto";
import axios from "axios";

export default class SqrRoleService {
    private readonly _rootService: RootService;
    private readonly _restPath: string;

    constructor(rootService: RootService) {
        this._rootService = rootService;
        this._restPath = `${rootService.restUrl}/sqr-role`;
        makeAutoObservable(this);
    }

    async getRoles(): Promise<SqrRoleDto[]> {
        return (await axios.get<SqrRoleDto[]>(`${this._restPath}`)).data;
    }

    async getRole(id: SqrRoleDto['id']): Promise<SqrRoleDto> {
        return (await axios.get<SqrRoleDto>(`${this._restPath}/${id}`)).data;
    }

    async createRole(admRole: SqrRoleDto): Promise<SqrRoleDto> {
        return (await axios.post<SqrRoleDto>(`${this._restPath}`, admRole)).data;
    }

    async editRole(id: SqrRoleDto['id'], admRole: SqrRoleDto): Promise<SqrRoleDto> {
        return (await axios.put<SqrRoleDto>(`${this._restPath}/${id}`, admRole)).data;
    }

    async deleteRoles(ids: SqrRoleDto['id'][]): Promise<void> {
        await axios.delete(`${this._restPath}/${ids.join(',')}`);
    }
}

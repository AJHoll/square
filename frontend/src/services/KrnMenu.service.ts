import RootService from './Root.service';
import {makeAutoObservable} from 'mobx';
import {KrnMenuItemDto} from '../dtos/KrnMenuItem.dto';
import axios from 'axios';
import {AdmRoleDto} from '../dtos/AdmRole.dto';

export default class KrnMenuService {
    private readonly _rootService: RootService;

    get restPath(): string {
        return `${this._rootService.restUrl}/krn-menu`;
    }

    constructor(rootService: RootService) {
        this._rootService = rootService;
        makeAutoObservable(this);
    }

    async getMenuItemsWithoutRole(roleId: AdmRoleDto['id']): Promise<KrnMenuItemDto[]> {
        return (await axios.get<KrnMenuItemDto[]>(`${this.restPath}/exclude-role/${roleId}`)).data;
    }
}
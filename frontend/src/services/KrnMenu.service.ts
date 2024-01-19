import RootService from './Root.service';
import { makeAutoObservable } from 'mobx';
import { KrnMenuItemDto } from '../dtos/KrnMenuItem.dto';
import axios from 'axios';
import { AdmRoleDto } from '../dtos/AdmRole.dto';

export default class KrnMenuService {
  private readonly _rootService: RootService;
  private readonly _restPath: string;

  constructor(rootService: RootService) {
    this._rootService = rootService;
    this._restPath = `${rootService.restUrl}/krn-menu`;
    makeAutoObservable(this);
  }

  async getMenuItemsWithoutRole(roleId: AdmRoleDto['id']): Promise<KrnMenuItemDto[]> {
    return (await axios.get<KrnMenuItemDto[]>(`${this._restPath}/exclude-role/${roleId}`)).data;
  }
}
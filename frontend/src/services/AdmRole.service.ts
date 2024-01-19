import RootService from './Root.service';
import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import { AdmRoleDto } from '../dtos/AdmRole.dto';
import { AdmRoleMenuDto } from '../dtos/AdmRoleMenu.dto';
import { KrnMenuItemDto } from '../dtos/KrnMenuItem.dto';

export default class AdmRoleService {
  private readonly _rootService: RootService;
  private readonly _restPath: string;

  constructor(rootService: RootService) {
    this._rootService = rootService;
    this._restPath = `${rootService.restUrl}/adm-role`;
    makeAutoObservable(this);
  }

  // ROLE
  async getRoles(): Promise<AdmRoleDto[]> {
    return (await axios.get<AdmRoleDto[]>(`${this._restPath}`)).data;
  }

  async getRole(id: AdmRoleDto['id']): Promise<AdmRoleDto> {
    return (await axios.get<AdmRoleDto>(`${this._restPath}/${id}`)).data;
  }

  async createRole(admRole: AdmRoleDto): Promise<AdmRoleDto> {
    return (await axios.post<AdmRoleDto>(`${this._restPath}`, admRole)).data;
  }

  async editRole(id: AdmRoleDto['id'], admRole: AdmRoleDto): Promise<AdmRoleDto> {
    return (await axios.put<AdmRoleDto>(`${this._restPath}/${id}`, admRole)).data;
  }

  async deleteRoles(ids: AdmRoleDto['id'][]): Promise<void> {
    await axios.delete(`${this._restPath}/${ids.join(',')}`);
  }

  // ROLE MENU ITEM

  async getRoleMenuItems(roleId: AdmRoleDto['id']): Promise<AdmRoleMenuDto[]> {
    return (await axios.get<AdmRoleMenuDto[]>(`${this._restPath}/${roleId}/menu-item/`)).data;
  }

  async addMenuItemToRole(roleId: AdmRoleDto['id'], addMenuItems: KrnMenuItemDto[]): Promise<void> {
    await axios.post<void>(`${this._restPath}/${roleId}/menu-item/${addMenuItems.map(i => i.id).join(',')}`);
  }

  async removeMenuItemsFromRole(roleId: AdmRoleDto['id'], removeRoleMenus: AdmRoleMenuDto[]): Promise<void> {
    await axios.delete<void>(`${this._restPath}/${roleId}/menu-item/${removeRoleMenus.map(i => i.id).join(',')}`);
  }
}
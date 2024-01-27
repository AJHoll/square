import RootService from './Root.service';
import { makeAutoObservable } from 'mobx';
import { AdmGroupDto } from '../dtos/AdmGroup.dto';
import axios from 'axios';
import { AdmRoleMenuDto } from '../dtos/AdmRoleMenu.dto';
import { AdmGroupRoleDto } from '../dtos/AdmGroupRole.dto';
import { AdmRoleDto } from '../dtos/AdmRole.dto';

export default class AdmGroupService {
  private readonly _rootService: RootService;
  private readonly _restPath: string;

  constructor(rootService: RootService) {
    this._rootService = rootService;
    this._restPath = `${rootService.restUrl}/adm-group`;
    makeAutoObservable(this);
  }

  async getGroups(): Promise<AdmGroupDto[]> {
    return (await axios.get<AdmGroupDto[]>(`${this._restPath}`)).data;
  }

  async getGroup(id: AdmGroupDto['id']): Promise<AdmGroupDto> {
    return (await axios.get<AdmGroupDto>(`${this._restPath}/${id}`)).data;
  }

  async createGroup(admRole: AdmGroupDto): Promise<AdmGroupDto> {
    return (await axios.post<AdmGroupDto>(`${this._restPath}`, admRole)).data;
  }

  async editGroup(id: AdmGroupDto['id'], admRole: AdmGroupDto): Promise<AdmGroupDto> {
    return (await axios.put<AdmGroupDto>(`${this._restPath}/${id}`, admRole)).data;
  }

  async deleteGroups(ids: AdmGroupDto['id'][]): Promise<void> {
    await axios.delete(`${this._restPath}/${ids.join(',')}`);
  }

  async getGroupRoles(groupId: AdmGroupDto['id']): Promise<AdmGroupRoleDto[]> {
    return (await axios.get<AdmRoleMenuDto[]>(`${this._restPath}/${groupId}/role/`)).data;
  }

  async addRolesToGroup(groupId: AdmGroupDto['id'], roles: AdmRoleDto[]): Promise<void> {
    await axios.post<void>(`${this._restPath}/${groupId}/role/${roles.map(r => r.id).join(',')}`);
  }

  async remoeRolesFromGroup(groupId: AdmGroupDto['id'], roles: AdmGroupRoleDto[]): Promise<void> {
    await axios.delete<void>(`${this._restPath}/${groupId}/role/${roles.map(r => r.id).join(',')}`);
  }
}
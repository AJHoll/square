import RootStore from '../../Root.store';
import AdmGroupService from '../../../services/AdmGroup.service';
import { makeAutoObservable } from 'mobx';
import { GridApi, SelectionChangedEvent } from 'ag-grid-community';
import { AdmGroupRoleDto } from '../../../dtos/AdmGroupRole.dto';
import { AdmRoleDto } from '../../../dtos/AdmRole.dto';
import { AdmGroupDto } from '../../../dtos/AdmGroup.dto';
import AdmRoleService from '../../../services/AdmRole.service';

export default class AdmGroupRoleStore {
  private readonly _rootStore: RootStore;
  private readonly _admGroupService: AdmGroupService;
  private readonly _admRoleService: AdmRoleService;

  private _groupId: AdmGroupDto['id'];
  private _selectionGroupRole: AdmGroupRoleDto[] = [];
  private _selectionRoles: AdmRoleDto[] = [];

  private _groupRoleGridApi: GridApi<AdmGroupRoleDto> | undefined;

  set groupRoleGridApi(value: GridApi<AdmGroupRoleDto>) {
    this._groupRoleGridApi = value;
  }

  private _roleGridApi: GridApi<AdmRoleDto> | undefined;
  set roleGridApi(value: GridApi<AdmRoleDto>) {
    this._roleGridApi = value;
  }

  get addRoleToGroupBtnDisabled(): boolean {
    return !this._groupId || (this._selectionRoles ?? []).length === 0 || this._groupId === 1;
  }

  get removeRoleFromGroupBtnDisabled(): boolean {
    return !this._groupId || (this._selectionGroupRole ?? []).length === 0 || this._groupId === 1;
  }

  constructor(rootStore: RootStore,
              admGroupService: AdmGroupService,
              admRoleService: AdmRoleService) {
    this._rootStore = rootStore;
    this._admGroupService = admGroupService;
    this._admRoleService = admRoleService;
    makeAutoObservable(this);
  }

  async setGroupId(groupId: AdmGroupDto['id']): Promise<void> {
    const isGroupChange: boolean = this._groupId !== groupId;
    this._groupId = groupId;
    if (isGroupChange) {
      await Promise.all([this.reloadGroupRoles(), this.reloadRoles()]);
    }
  }

  async reloadGroupRoles(): Promise<void> {
    this._selectionGroupRole = [];
    this._groupRoleGridApi?.setRowData([]);
    this._groupRoleGridApi?.showLoadingOverlay();
    if (this._groupId) {
      const data = await this._admGroupService.getGroupRoles(this._groupId);
      this._groupRoleGridApi?.setRowData(data ?? []);
    } else {
      this._groupRoleGridApi?.setRowData([]);
    }
  }

  async reloadRoles(): Promise<void> {
    this._selectionRoles = [];
    this._roleGridApi?.setRowData([]);
    this._roleGridApi?.showLoadingOverlay();
    if (this._groupId) {
      const data = await this._admRoleService.getRoleExcludeGroup(this._groupId);
      this._roleGridApi?.setRowData(data ?? []);
    } else {
      this._roleGridApi?.setRowData([]);
    }
  }

  groupRoleSelectionChange(event: SelectionChangedEvent<AdmGroupRoleDto>): void {
    this._selectionGroupRole = event.api.getSelectedRows();
  }

  roleSelectionChange(event: SelectionChangedEvent<AdmRoleDto>): void {
    this._selectionRoles = event.api.getSelectedRows();
  }

  async addRoleToGroup(): Promise<void> {
    await this._admGroupService.addRolesToGroup(this._groupId, this._selectionRoles);
    await Promise.all([this.reloadGroupRoles(), this.reloadRoles()]);
  }

  async removeRoleFromGroup(): Promise<void> {
    await this._admGroupService.remoeRolesFromGroup(this._groupId, this._selectionGroupRole);
    await Promise.all([this.reloadGroupRoles(), this.reloadRoles()]);
  }
}
import RootStore from '../../Root.store';
import AdmRoleService from '../../../services/AdmRole.service';
import { makeAutoObservable } from 'mobx';
import { AdmRoleDto } from '../../../dtos/AdmRole.dto';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { AdmRoleMenuDto } from '../../../dtos/AdmRoleMenu.dto';

export default class AdmRoleMenuStore {
  private readonly _rootService: RootStore;
  private readonly _admRoleService: AdmRoleService;

  private _gridApi: GridApi<AdmRoleMenuDto> | undefined;
  set gridApi(value: GridApi<AdmRoleMenuDto>) {
    this._gridApi = value;
  }

  get gridApi(): GridApi<AdmRoleMenuDto> {
    return this._gridApi!;
  }

  private _columnApi: ColumnApi | undefined;
  set columnApi(value: ColumnApi | undefined) {
    this._columnApi = value;
  }

  get columnApi(): ColumnApi | undefined {
    return this._columnApi;
  }

  private _roleId: AdmRoleDto['id'];

  constructor(rootStore: RootStore, admRoleService: AdmRoleService) {
    this._rootService = rootStore;
    this._admRoleService = admRoleService;
    makeAutoObservable(this);
  }

  async setRoleId(roleId: AdmRoleDto['id']): Promise<void> {
    const isRoleChange: boolean = this._roleId !== roleId;
    this._roleId = roleId;
    if (isRoleChange) {
      await this.reloadRoles();
    }
  }

  async reloadRoles(): Promise<void> {
    if (this._roleId) {
      const data = await this._admRoleService.getRoleMenuItems(this._roleId);
      this._gridApi?.setRowData(data ?? []);
    } else {
      this._gridApi?.setRowData([]);
    }
  }
}
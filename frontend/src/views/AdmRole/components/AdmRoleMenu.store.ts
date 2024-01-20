import RootStore from '../../Root.store';
import AdmRoleService from '../../../services/AdmRole.service';
import { makeAutoObservable } from 'mobx';
import { AdmRoleDto } from '../../../dtos/AdmRole.dto';
import { GridApi, SelectionChangedEvent } from 'ag-grid-community';
import { AdmRoleMenuDto } from '../../../dtos/AdmRoleMenu.dto';
import { KrnMenuItemDto } from '../../../dtos/KrnMenuItem.dto';
import KrnMenuService from '../../../services/KrnMenu.service';

export default class AdmRoleMenuStore {
  private readonly _rootService: RootStore;
  private readonly _admRoleService: AdmRoleService;
  private readonly _krnMenuService: KrnMenuService;

  private _roleMenuGridApi: GridApi<AdmRoleMenuDto> | undefined;
  set roleMenuGridApi(value: GridApi<AdmRoleMenuDto>) {
    this._roleMenuGridApi = value;
  }

  private _menuGridApi: GridApi<KrnMenuItemDto> | undefined;
  set menuGridApi(value: GridApi<KrnMenuItemDto>) {
    this._menuGridApi = value;
  }

  private _roleId: AdmRoleDto['id'];
  private _selectionRoleMenus: AdmRoleMenuDto[] = [];
  private _selectionMenuItems: KrnMenuItemDto[] = [];

  get addMenuItemToRoleBtnDisabled(): boolean {
    return !this._roleId || (this._selectionMenuItems ?? []).length === 0;
  }

  get removeMenuItemsFromRoleBtnDisabled(): boolean {
    return !this._roleId || (this._selectionRoleMenus ?? []).length === 0;
  }

  constructor(rootStore: RootStore,
              admRoleService: AdmRoleService,
              krnMenuService: KrnMenuService) {
    this._rootService = rootStore;
    this._admRoleService = admRoleService;
    this._krnMenuService = krnMenuService;
    makeAutoObservable(this);
  }

  async setRoleId(roleId: AdmRoleDto['id']): Promise<void> {
    const isRoleChange: boolean = this._roleId !== roleId;
    this._roleId = roleId;
    if (isRoleChange) {
      await Promise.all([this.reloadRoleMenuItems(), this.reloadMenuItems()]);
    }
  }

  async reloadRoleMenuItems(): Promise<void> {
    this._selectionRoleMenus = [];
    this._roleMenuGridApi?.setRowData([]);
    this._roleMenuGridApi?.showLoadingOverlay();
    if (this._roleId) {
      const data = await this._admRoleService.getRoleMenuItems(this._roleId);
      this._roleMenuGridApi?.setRowData(data ?? []);
    } else {
      this._roleMenuGridApi?.setRowData([]);
    }
  }

  async reloadMenuItems(): Promise<void> {
    this._selectionMenuItems = [];
    this._menuGridApi?.setRowData([]);
    this._menuGridApi?.showLoadingOverlay();
    if (!!this._roleId) {
      const data = await this._krnMenuService.getMenuItemsWithoutRole(this._roleId);
      this._menuGridApi?.setRowData(data ?? []);
    } else {
      this._menuGridApi?.setRowData([]);
    }


  }

  roleMenuItemSelectionChange(event: SelectionChangedEvent<AdmRoleMenuDto>): void {
    this._selectionRoleMenus = event.api.getSelectedRows();
  }

  menuItemSelectionChange(event: SelectionChangedEvent<KrnMenuItemDto>): void {
    this._selectionMenuItems = event.api.getSelectedRows();
  }

  async addMenuItemToRole(): Promise<void> {
    await this._admRoleService.addMenuItemToRole(this._roleId, this._selectionMenuItems);
    await Promise.all([this.reloadRoleMenuItems(), this.reloadMenuItems()]);
  }

  async removeMenuItemsFromRole(): Promise<void> {
    await this._admRoleService.removeMenuItemsFromRole(this._roleId, this._selectionRoleMenus);
    await Promise.all([this.reloadRoleMenuItems(), this.reloadMenuItems()]);
  }
}
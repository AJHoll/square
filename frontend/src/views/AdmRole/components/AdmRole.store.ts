import { makeAutoObservable } from 'mobx';
import RootStore from '../../Root.store';
import AdmRoleService from '../../../services/AdmRole.service';
import { ColumnApi, GridApi, SelectionChangedEvent } from 'ag-grid-community';
import { AdmRoleDto } from '../../../dtos/AdmRole.dto';
import AdmRoleCardStore from './AdmRoleCard.store';


export default class AdmRoleStore {
  private readonly _rootStore: RootStore;
  private readonly _admRoleCardStore: AdmRoleCardStore;
  private readonly _admRoleService: AdmRoleService;

  private _gridApi: GridApi<AdmRoleDto> | undefined;
  set gridApi(value: GridApi<AdmRoleDto>) {
    this._gridApi = value;
  }

  get gridApi(): GridApi<AdmRoleDto> {
    return this._gridApi!;
  }

  private _columnApi: ColumnApi | undefined;
  set columnApi(value: ColumnApi | undefined) {
    this._columnApi = value;
  }

  private _selectedRoleIds: AdmRoleDto['id'][] = [];
  set selectedRoleIds(value: AdmRoleDto['id'][]) {
    this._selectedRoleIds = value;
  }

  get editBtnDisabled(): boolean {
    return (this._selectedRoleIds ?? []).length !== 1 || this._selectedRoleIds.includes(1);
  }

  get deleteBtnDisabled(): boolean {
    return (this._selectedRoleIds ?? []).length === 0 || this._selectedRoleIds.includes(1);
  }

  constructor(rootStore: RootStore,
              admRoleService: AdmRoleService) {
    this._rootStore = rootStore;
    this._admRoleService = admRoleService;
    this._admRoleCardStore = this._rootStore.admRoleCardStore;
    makeAutoObservable(this);
  }

  async reloadRoles(): Promise<void> {
    const data = await this._admRoleService.getRoles();
    this.selectedRoleIds = [];
    this._gridApi?.deselectAll();
    if (data) {
      this._gridApi?.setRowData(data);
    } else {
      this._rootStore.message.error('Ошибка получения данных', 'Ошибка при получении списка ролей');
    }
  }

  async roleSelectionChange(event: SelectionChangedEvent<AdmRoleDto>): Promise<void> {
    this.selectedRoleIds = event.api.getSelectedRows().map(row => row.id);
    await this._rootStore.admRoleMenuStore.setRoleId(this._selectedRoleIds.length === 1 ? this._selectedRoleIds[0] : undefined);
  }

  createNewRole(): void {
    this._admRoleCardStore.title = 'Новая роль';
    this._admRoleCardStore.admRole = {};
    this._admRoleCardStore.visible = true;
  }

  async editRole(): Promise<void> {
    const role = await this._admRoleService.getRole(this._selectedRoleIds[0]);
    if (role) {
      this._admRoleCardStore.title = `Редактирование роли (id: ${role.id})`;
      this._admRoleCardStore.admRole = role;
      this._admRoleCardStore.visible = true;
    } else {
      this._rootStore.message.error('Ошибка получения данных', `Не удалость найти роль с ID = ${this._selectedRoleIds[0]}`);
    }
  }

  async deleteRole(): Promise<void> {
    await this._admRoleService.deleteRoles(this._selectedRoleIds);
    await this.reloadRoles();
  }
}
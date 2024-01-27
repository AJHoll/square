import RootStore from '../../Root.store';
import { makeAutoObservable } from 'mobx';
import AdmGroupService from '../../../services/AdmGroup.service';
import { ColumnApi, GridApi, SelectionChangedEvent } from 'ag-grid-community';
import { AdmGroupDto } from '../../../dtos/AdmGroup.dto';
import { AdmRoleDto } from '../../../dtos/AdmRole.dto';
import AdmGroupCardStore from './AdmGroupCard.store';

export default class AdmGroupStore {
  private readonly _rootStore: RootStore;
  private readonly _admGroupCardStore: AdmGroupCardStore;
  private readonly _admGroupService: AdmGroupService;

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


  private _selectedGroupIds: AdmGroupDto['id'][] = [];
  set selectedGroupIds(value: AdmGroupDto['id'][]) {
    this._selectedGroupIds = value;
  }

  get editBtnDisabled(): boolean {
    return (this._selectedGroupIds ?? []).length !== 1 || this._selectedGroupIds.includes(1);
  }

  get deleteBtnDisabled(): boolean {
    return (this._selectedGroupIds ?? []).length === 0 || this._selectedGroupIds.includes(1);
  }

  constructor(rootStore: RootStore,
              admGroupService: AdmGroupService) {
    this._rootStore = rootStore;
    this._admGroupCardStore = rootStore.admGroupCardStore;
    this._admGroupService = admGroupService;
    makeAutoObservable(this);
  }

  async reloadGroups(): Promise<void> {
    const data = await this._admGroupService.getGroups();
    this.selectedGroupIds = [];
    this._gridApi?.deselectAll();
    if (data) {
      this._gridApi?.setRowData(data);
    } else {
      this._rootStore.message.error('Ошибка получения данных', 'Ошибка при получении списка групп');
    }
  }

  async groupSelectionChange(event: SelectionChangedEvent<AdmGroupDto>): Promise<void> {
    this.selectedGroupIds = event.api.getSelectedRows().map(row => row.id);
    await this._rootStore.admGroupRoleStore.setGroupId(this._selectedGroupIds.length === 1 ? this._selectedGroupIds[0] : undefined);
  }

  createNewGroup(): void {
    this._admGroupCardStore.title = 'Новая группа';
    this._admGroupCardStore.admGroup = {};
    this._admGroupCardStore.visible = true;
  }

  async editGroup(): Promise<void> {
    const group = await this._admGroupService.getGroup(this._selectedGroupIds[0]);
    if (group) {
      this._admGroupCardStore.title = `Редактирование группы (id: ${group.id})`;
      this._admGroupCardStore.admGroup = group;
      this._admGroupCardStore.visible = true;
    } else {
      this._rootStore.message.error('Ошибка получения данных', `Не удалость найти группу с ID = ${this._selectedGroupIds[0]}`);
    }
  }

  async deleteGroups(): Promise<void> {
    await this._admGroupService.deleteGroups(this._selectedGroupIds);
    await this.reloadGroups();
  }
}
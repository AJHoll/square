import RootStore from "../../Root.store";
import SqrRoleService from "../../../services/SqrRole.service";
import {ColumnApi, GridApi, SelectionChangedEvent} from "ag-grid-community";
import {SqrRoleDto} from "../../../dtos/SqrRole.dto";
import {SqrRoleCardStore} from "./SqrRoleCard.store";
import {makeAutoObservable} from "mobx";

export class SqrRoleStore {
    private readonly _rootStore: RootStore;
    private readonly _sqrRoleCardStore: SqrRoleCardStore;
    private readonly _sqrRoleService: SqrRoleService;

    private _gridApi: GridApi<SqrRoleDto> | undefined;
    set gridApi(value: GridApi<SqrRoleDto>) {
        this._gridApi = value;
    }

    get gridApi(): GridApi<SqrRoleDto> {
        return this._gridApi!;
    }

    private _columnApi: ColumnApi | undefined;
    set columnApi(value: ColumnApi | undefined) {
        this._columnApi = value;
    }

    private _selectedRoleIds: SqrRoleDto['id'][] = [];
    set selectedRoleIds(value: SqrRoleDto['id'][]) {
        this._selectedRoleIds = value;
    }

    get editBtnDisabled(): boolean {
        return (this._selectedRoleIds ?? []).length !== 1;
    }

    get deleteBtnDisabled(): boolean {
        return (this._selectedRoleIds ?? []).length === 0;
    }

    constructor(rootStore: RootStore, sqrRoleService: SqrRoleService) {
        this._rootStore = rootStore;
        this._sqrRoleCardStore = rootStore.sqrRoleCardStore;
        this._sqrRoleService = sqrRoleService;
        makeAutoObservable(this);
    }


    async reloadRoles(): Promise<void> {
        const data = await this._sqrRoleService.getRoles();
        this.selectedRoleIds = [];
        this._gridApi?.deselectAll();
        if (data) {
            this._gridApi?.setRowData(data);
        } else {
            this._rootStore.message.error('Ошибка получения данных', 'Ошибка при получении списка ролей на площадке');
        }
    }

    async roleSelectionChange(event: SelectionChangedEvent<SqrRoleDto>): Promise<void> {
        this.selectedRoleIds = event.api.getSelectedRows().map(row => row.id);
    }

    createNewRole(): void {
        this._sqrRoleCardStore.title = 'Новая роль площадки';
        this._sqrRoleCardStore.sqrRole = {};
        this._sqrRoleCardStore.visible = true;
    }

    async editRole(): Promise<void> {
        const role = await this._sqrRoleService.getRole(this._selectedRoleIds[0]);
        if (role) {
            this._sqrRoleCardStore.title = `Редактирование роли (id: ${role.id})`;
            this._sqrRoleCardStore.sqrRole = role;
            this._sqrRoleCardStore.visible = true;
        } else {
            this._rootStore.message.error('Ошибка получения данных', `Не удалость найти роль площадки с ID = ${this._selectedRoleIds[0]}`);
        }
    }

    async deleteRole(): Promise<void> {
        await this._sqrRoleService.deleteRoles(this._selectedRoleIds);
        await this.reloadRoles();
    }
}
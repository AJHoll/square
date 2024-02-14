import RootStore from "../../Root.store";
import {makeAutoObservable} from "mobx";
import {GridApi, SelectionChangedEvent} from "ag-grid-community";
import {SqrSquareDto} from "../../../dtos/SqrSquare.dto";
import {SqrRoleDto} from "../../../dtos/SqrRole.dto";
import {SqrSquareUserDto} from "../../../dtos/SqrSquareUser.dto";
import SqrSquareService from "../../../services/SqrSquare.service";
import {UFilterItem} from "../../../components/DevsGrid/DevsGridFilterItem";

export default class SqrSquareUserStore {
    private readonly _rootStore: RootStore;
    private readonly _sqrSquareService: SqrSquareService;


    private _sqrRolesGridApi: GridApi<SqrRoleDto> | undefined;
    set sqrRolesGridApi(value: GridApi<SqrRoleDto>) {
        this._sqrRolesGridApi = value;
    }

    private _squareUserGridApi: GridApi<SqrSquareUserDto> | undefined;
    set squareUserGridApi(value: GridApi<SqrSquareUserDto>) {
        this._squareUserGridApi = value;
    }

    private _squareId: SqrSquareDto['id'];
    private _selectionSqrRoles: SqrRoleDto[] = [];
    private _selectionSquareUsers: SqrSquareUserDto[] = [];
    private _squareUserFilters: { [p: string]: UFilterItem } = {
        fast_filter: {
            fieldName: 'fast_filter',
            fieldTitle: 'ФИО',
            value: '',
            type: 'string'
        }
    }

    get squareUserFilters(): { [p: string]: UFilterItem } {
        return this._squareUserFilters;
    }

    private _mode: 'view' | 'modify' = 'view';
    get mode(): "view" | "modify" {
        return this._mode;
    }

    get selectionRoleCaption(): string {
        return this._selectionSqrRoles[0]?.caption ?? '';
    }

    get modeBtnDisabled(): boolean {
        return !this._squareId;
    }

    get addUsersToSquareRoleBtnDisabled(): boolean {
        return this._mode !== 'modify' || (this._selectionSquareUsers ?? []).length === 0
            || this._selectionSquareUsers.findIndex(su => su.activeInSquareRole) !== -1;
    }

    get removeUsersFromSquareRoleBtnDisabled(): boolean {
        return this._mode !== 'modify' || (this._selectionSquareUsers ?? []).length === 0
            || this._selectionSquareUsers.findIndex(su => !su.activeInSquareRole) !== -1;
    }

    constructor(rootStore: RootStore, sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrSquareService = sqrSquareService;
        makeAutoObservable(this);
    }

    async setSquareId(squareId: SqrSquareDto['id']): Promise<void> {
        const isSquareChange: boolean = this._squareId !== squareId;
        this._squareId = squareId;
        if (isSquareChange) {
            await this.reloadSqrRoles();
        }
    }

    async reloadSqrRoles(): Promise<void> {
        this._selectionSqrRoles = [];
        this._sqrRolesGridApi?.setRowData([]);
        this._sqrRolesGridApi?.showLoadingOverlay();
        if (this._squareId) {
            const data = await this._sqrSquareService.getSquareRoles(this._squareId);
            this._sqrRolesGridApi?.setRowData(data ?? []);
        } else {
            this._sqrRolesGridApi?.setRowData([]);
        }
    }

    async reloadSqrSquareUsers(): Promise<void> {
        this._selectionSquareUsers = [];
        this._squareUserGridApi?.setRowData([]);
        this._squareUserGridApi?.showLoadingOverlay();
        if (!!this._squareId) {
            const data = await this._sqrSquareService.getSquareRoleUsers(this._squareId, this._selectionSqrRoles[0]?.id, this._squareUserFilters, this._mode === "modify");
            this._squareUserGridApi?.setRowData(data ?? []);
        } else {
            this._squareUserGridApi?.setRowData([]);
        }
    }

    async sqrRoleSelectionChange(event: SelectionChangedEvent<SqrRoleDto>): Promise<void> {
        this._selectionSqrRoles = event.api.getSelectedRows();
        await this.reloadSqrSquareUsers();
    }

    squareUserSelectionChange(event: SelectionChangedEvent<SqrSquareUserDto>): void {
        this._selectionSquareUsers = event.api.getSelectedRows();
    }

    async toggleMode(): Promise<void> {
        this._mode = this._mode === 'view' ? 'modify' : 'view';
        await this.reloadSqrSquareUsers();
    }

    async onSquareUserFilterConfirm(filters: { [p: string]: UFilterItem }): Promise<void> {
        this._squareUserFilters = filters;
        await this.reloadSqrSquareUsers();
    }

    async addUsersToSquareRole(): Promise<void> {
        await this._sqrSquareService.addUsersToSquareRole(this._squareId,
            this._selectionSquareUsers.map(su => su.id),
            this._selectionSqrRoles.map(r => r.id));
        await this.reloadSqrSquareUsers();
    }

    async removeUsersFromSquareRole(): Promise<void> {
        await this._sqrSquareService.removeUsersFromSquareRole(this._squareId,
            this._selectionSquareUsers.map(su => su.id),
            this._selectionSqrRoles.map(r => r.id));
        await this.reloadSqrSquareUsers();
    }
}
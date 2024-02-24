import RootStore from "../../Root.store";
import SqrSquareService from "../../../services/SqrSquare.service";
import {makeAutoObservable} from "mobx";
import {SqrSquareDto} from "../../../dtos/SqrSquare.dto";
import {UFilterItem} from "../../../components/DevsGrid/DevsGridFilterItem";
import {SqrTeamDto} from "../../../dtos/SqrTeam.dto";
import {SqrSquareTeamUserDto} from "../../../dtos/SqrSquareTeamUserDto";
import {GridApi, SelectionChangedEvent} from "ag-grid-community";
import SqrSquareTeamCardStore from "./SqrSquareTeamCard.store";

export default class SqrSquareTeamStore {
    private readonly _rootStore: RootStore;
    private readonly _sqrSquareTeamCardStore: SqrSquareTeamCardStore;
    private readonly _sqrSquareService: SqrSquareService;

    private _sqrTeamsGridApi: GridApi<SqrTeamDto> | undefined;
    set sqrTeamsGridApi(value: GridApi<SqrTeamDto>) {
        this._sqrTeamsGridApi = value;
    }

    private _squareRoleUserGridApi: GridApi<SqrSquareTeamUserDto> | undefined;
    set squareRoleUserGridApi(value: GridApi<SqrSquareTeamUserDto>) {
        this._squareRoleUserGridApi = value;
    }

    private _mode: 'view' | 'modify' = 'view';
    get mode(): "view" | "modify" {
        return this._mode;
    }

    get modeBtnDisabled(): boolean {
        return !this._squareId;
    }

    private _squareId: SqrSquareDto['id'];
    private _selectionSqrTeams: SqrTeamDto[] = [];
    private _selectionSquareTeamUsers: SqrSquareTeamUserDto[] = [];
    private _squareTeamUserFilters: { [p: string]: UFilterItem } = {
        fast_filter: {
            fieldName: 'fast_filter',
            fieldTitle: 'ФИО',
            value: '',
            type: 'string'
        }
    }

    get squareTeamUserFilters(): { [p: string]: UFilterItem } {
        return this._squareTeamUserFilters;
    }

    get createTeamBtnDisabled(): boolean {
        return !this._squareId;
    }

    get editTeamBtnDisabled(): boolean {
        return (this._selectionSqrTeams ?? []).length !== 1;
    }

    get deleteTeamBtnDisabled(): boolean {
        return (this._selectionSqrTeams ?? []).length === 0;
    }

    get addUsersToSquareTeamBtnDisabled(): boolean {
        return this._mode !== 'modify' || (this._selectionSquareTeamUsers ?? []).length === 0
            || this._selectionSquareTeamUsers.findIndex(su => su.user?.activeInSquareRole) !== -1;
    }

    get removeUsersFromSquareTeamBtnDisabled(): boolean {
        return this._mode !== 'modify' || (this._selectionSquareTeamUsers ?? []).length === 0
            || this._selectionSquareTeamUsers.findIndex(su => !su.user?.activeInSquareRole) !== -1;
    }

    constructor(rootStore: RootStore, sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrSquareTeamCardStore = rootStore.sqrSquareTeamCardStore;
        this._sqrSquareService = sqrSquareService;
        makeAutoObservable(this);
    }

    async setSquareId(squareId: SqrSquareDto['id']): Promise<void> {
        const isSquareChange: boolean = this._squareId !== squareId;
        this._squareId = squareId;
        if (isSquareChange) {
            await this.reloadSqrTeams();
        }
    }

    createNewTeam(): void {
        this._sqrSquareTeamCardStore.title = 'Новая команда';
        this._sqrSquareTeamCardStore.sqrTeam = {squareId: this._squareId};
        this._sqrSquareTeamCardStore.visible = true;
    }

    async editTeam(): Promise<void> {
        const team = await this._sqrSquareService.getSquareTeam(this._squareId, this._selectionSqrTeams[0]?.id);
        if (team) {
            this._sqrSquareTeamCardStore.title = `Редактирование команды (id: ${team.id})`;
            this._sqrSquareTeamCardStore.sqrTeam = team;
            this._sqrSquareTeamCardStore.visible = true;
        } else {
            this._rootStore.message.error('Ошибка получения данных', `Не удалость найти команду с ID = ${this._selectionSqrTeams[0]}`);
        }
    }

    async deleteTeams(): Promise<void> {
        await this._sqrSquareService.deleteTeams(this._squareId, this._selectionSqrTeams.map(team => team.id));
        await this.reloadSqrTeams();
    }

    async toggleMode(): Promise<void> {
        this._mode = this._mode === 'view' ? 'modify' : 'view';
        await this.reloadSqrSquareTeamUsers();
    }

    async reloadSqrTeams(): Promise<void> {
        this._selectionSqrTeams = [];
        this._sqrTeamsGridApi?.setRowData([]);
        this._sqrTeamsGridApi?.showLoadingOverlay();
        if (this._squareId) {
            const data = await this._sqrSquareService.getSquareTeams(this._squareId);
            this._sqrTeamsGridApi?.setRowData(data ?? []);
        } else {
            this._sqrTeamsGridApi?.setRowData([]);
        }
    }

    async reloadSqrSquareTeamUsers(): Promise<void> {
        this._selectionSquareTeamUsers = [];
        this._squareRoleUserGridApi?.setRowData([]);
        this._squareRoleUserGridApi?.showLoadingOverlay();
        if (!!this._squareId) {
            const data = await this._sqrSquareService.getSquareTeamUsers(this._squareId,
                this._selectionSqrTeams[0]?.id,
                this._squareTeamUserFilters,
                this._mode === "modify");
            this._squareRoleUserGridApi?.setRowData(data ?? []);
        } else {
            this._squareRoleUserGridApi?.setRowData([]);
        }
    }

    async onSqrTeamsSelectionChange(event: SelectionChangedEvent<SqrTeamDto>): Promise<void> {
        this._selectionSqrTeams = event.api.getSelectedRows();
        await this.reloadSqrSquareTeamUsers();
    }

    async onSquareTeamUsersSelectionChange(event: SelectionChangedEvent<SqrSquareTeamUserDto>): Promise<void> {
        this._selectionSquareTeamUsers = event.api.getSelectedRows();
    }

    async onSquareUserFilterConfirm(filters: { [p: string]: UFilterItem }): Promise<void> {
        this._squareTeamUserFilters = filters;
        await this.reloadSqrSquareTeamUsers();
    }

    async addUsersToSquareTeam(): Promise<void> {
        await this._sqrSquareService.addUsersToSquareTeam(this._squareId,
            this._selectionSquareTeamUsers.map(su => su.id),
            this._selectionSqrTeams.map(r => r.id));
        await this.reloadSqrSquareTeamUsers();
    }

    async removeUsersFromSquareTeam(): Promise<void> {
        await this._sqrSquareService.removeUsersFromSquareTeam(this._squareId,
            this._selectionSquareTeamUsers.map(su => su.id),
            this._selectionSqrTeams.map(r => r.id));
        await this.reloadSqrSquareTeamUsers();
    }
}
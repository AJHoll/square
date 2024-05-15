import RootStore from "../../Root.store";
import SqrSquareService from "../../../services/SqrSquare.service";
import {makeAutoObservable} from "mobx";
import {GridApi, SelectionChangedEvent} from "ag-grid-community";
import {SqrSquareEvalGroupDto} from "../../../dtos/SqrSquareEvalGroup.dto";
import {SqrSquareEvalGroupUserDto} from "../../../dtos/SqrSquareEvalGroupUser.dto";
import {SqrSquareDto} from "../../../dtos/SqrSquare.dto";
import {UFilterItem} from "../../../components/DevsGrid/DevsGridFilterItem";

export default class SqrSquareEvalGroupStore {
    private readonly _rootStore: RootStore;
    private readonly _sqrSquareService: SqrSquareService;

    private _squareEvalGroupGridApi: GridApi<SqrSquareEvalGroupDto> | undefined;
    set squareEvalGroupGridApi(value: GridApi<SqrSquareEvalGroupDto>) {
        this._squareEvalGroupGridApi = value;
    }

    private _squareEvalGroupUserGridApi: GridApi<SqrSquareEvalGroupUserDto> | undefined;
    set squareEvalGroupUserGridApi(value: GridApi<SqrSquareEvalGroupUserDto>) {
        this._squareEvalGroupUserGridApi = value;
    }

    private _mode: 'view' | 'modify' = 'view';
    get mode(): "view" | "modify" {
        return this._mode;
    }

    get modeBtnDisabled(): boolean {
        return !this._squareId;
    }

    private _squareId: SqrSquareDto['id'];

    private _selectionSqrEvalGroups: SqrSquareEvalGroupDto[] = [];
    private _selectionSquareEvalGroupUsers: SqrSquareEvalGroupUserDto[] = [];
    private _squareEvalGroupUserFilters: { [p: string]: UFilterItem } = {
        fast_filter: {
            fieldName: 'fast_filter',
            fieldTitle: 'ФИО',
            value: '',
            type: 'string'
        }
    }

    get squareEvalGroupUserFilters(): { [p: string]: UFilterItem } {
        return this._squareEvalGroupUserFilters;
    }

    get createEvalGroupBtnDisabled(): boolean {
        return !this._squareId;
    }

    get editEvalGroupBtnDisabled(): boolean {
        return false;
        // return (this._selectionSqrTeams ?? []).length !== 1;
    }

    get deleteEvalGroupsBtnDisabled(): boolean {
        return false;
        // return (this._selectionSqrTeams ?? []).length === 0;
    }

    get addUsersToEvalGroupBtnDisabled(): boolean {
        return false;
        /*         return this._mode !== 'modify' || (this._selectionSquareTeamUsers ?? []).length === 0
                     || this._selectionSquareTeamUsers.findIndex(su => su.user?.activeInSquareRole) !== -1;*/
    }

    get removeUsersFromEvalGroupBtnDisabled(): boolean {
        return false;
        /*         return this._mode !== 'modify' || (this._selectionSquareTeamUsers ?? []).length === 0
                     || this._selectionSquareTeamUsers.findIndex(su => !su.user?.activeInSquareRole) !== -1;*/
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
            await this.reloadSqrEvalGroups();
        }
    }

    async reloadSqrEvalGroups(): Promise<void> {
        this._selectionSqrEvalGroups = [];
        this._squareEvalGroupGridApi?.setRowData([]);
        this._squareEvalGroupGridApi?.showLoadingOverlay();
        if (this._squareId) {
            const data = await this._sqrSquareService.getSquareEvalGroups(this._squareId);
            this._squareEvalGroupGridApi?.setRowData(data ?? []);
        } else {
            this._squareEvalGroupGridApi?.setRowData([]);
        }
    }

    async reloadSqrEvalGroupUsers(): Promise<void> {
        this._selectionSquareEvalGroupUsers = [];
        this._squareEvalGroupUserGridApi?.setRowData([]);
        this._squareEvalGroupUserGridApi?.showLoadingOverlay();
        if (!!this._squareId) {
            const data = await this._sqrSquareService.getSquareEvalGroupUsers(this._squareId,
                this._selectionSqrEvalGroups[0]?.id,
                this._squareEvalGroupUserFilters,
                this._mode === "modify");
            this._squareEvalGroupUserGridApi?.setRowData(data ?? []);
        } else {
            this._squareEvalGroupUserGridApi?.setRowData([]);
        }
    }

    async onSquareEvalGroupSelectionChange(event: SelectionChangedEvent<SqrSquareEvalGroupDto>): Promise<void> {
        this._selectionSqrEvalGroups = event.api.getSelectedRows();
        await this.reloadSqrEvalGroupUsers();
    }

    async onEvalGroupUsersSelectionChange(event: SelectionChangedEvent<SqrSquareEvalGroupUserDto>): Promise<void> {
        this._selectionSquareEvalGroupUsers = event.api.getSelectedRows();
    }

    async onEvalGroupUserFilterConfirm(filters: { [p: string]: UFilterItem }): Promise<void> {
        this._squareEvalGroupUserFilters = filters;
        await this.reloadSqrEvalGroups();
    }

    createEvalGroup(): void {
        /*        this._sqrSquareTeamCardStore.title = 'Новая команда';
                this._sqrSquareTeamCardStore.sqrTeam = {squareId: this._squareId};
                this._sqrSquareTeamCardStore.visible = true;*/
    }

    async editEvalGroup(): Promise<void> {
        /*const team = await this._sqrSquareService.getSquareTeam(this._squareId, this._selectionSqrTeams[0]?.id);
        if (team) {
            this._sqrSquareTeamCardStore.title = `Редактирование команды (id: ${team.id})`;
            this._sqrSquareTeamCardStore.sqrTeam = team;
            this._sqrSquareTeamCardStore.visible = true;
        } else {
            this._rootStore.message.error('Ошибка получения данных', `Не удалость найти команду с ID = ${this._selectionSqrTeams[0]}`);
        }*/
    }

    async deleteEvalGroups(): Promise<void> {
        /*        await this._sqrSquareService.deleteTeams(this._squareId, this._selectionSqrTeams.map(team => team.id));
                await this.reloadSqrTeams();*/
    }

    async toggleMode(): Promise<void> {
        this._mode = this._mode === 'view' ? 'modify' : 'view';
        await this.reloadSqrEvalGroupUsers();
    }

    async addUsersToEvalGroup(): Promise<void> {
        /*        await this._sqrSquareService.addUsersToSquareTeam(this._squareId,
                    this._selectionSquareTeamUsers.map(su => su.id),
                    this._selectionSqrTeams.map(r => r.id));
                await this.reloadSqrSquareTeamUsers();*/
    }

    async removeUsersFromEvalGroup(): Promise<void> {
        /*        await this._sqrSquareService.removeUsersFromSquareTeam(this._squareId,
                    this._selectionSquareTeamUsers.map(su => su.id),
                    this._selectionSqrTeams.map(r => r.id));
                await this.reloadSqrSquareTeamUsers();*/
    }
}
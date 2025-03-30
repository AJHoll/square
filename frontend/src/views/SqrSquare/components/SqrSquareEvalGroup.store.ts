import RootStore from "../../Root.store";
import SqrSquareService from "../../../services/SqrSquare.service";
import {makeAutoObservable} from "mobx";
import {GridApi, SelectionChangedEvent} from "ag-grid-community";
import {SqrSquareEvalGroupDto} from "../../../dtos/SqrSquareEvalGroup.dto";
import {SqrSquareEvalGroupUserDto} from "../../../dtos/SqrSquareEvalGroupUser.dto";
import {SqrSquareDto} from "../../../dtos/SqrSquare.dto";
import {UFilterItem} from "../../../components/DevsGrid/DevsGridFilterItem";
import {SqrSquareEvalGroupCardStore} from "./SqrSquareEvalGroupCard.store";
import {SelectOption} from "@ajholl/devsuikit";


export default class SqrSquareEvalGroupStore {
    private readonly _rootStore: RootStore;
    private readonly _sqrSquareEvalGroupCardStore: SqrSquareEvalGroupCardStore;
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

    get colorBtnDisabled(): boolean {
        return !this._squareId || this._mode !== 'view' || (this._selectionSquareEvalGroupUsers ?? []).length === 0;
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

    private _setEvalGroupUserColorCardVisible: boolean = false;
    get setEvalGroupUserColorCardVisible(): boolean {
        return this._setEvalGroupUserColorCardVisible;
    }

    set setEvalGroupUserColorCardVisible(value: boolean) {
        this._setEvalGroupUserColorCardVisible = value;
    }

    private _evalGroupUserColor: string = '000';
    get evalGroupUserColor(): string {
        return this._evalGroupUserColor;
    }

    set evalGroupUserColor(value: string) {
        this._evalGroupUserColor = value;
    }

    get squareEvalGroupUserFilters(): { [p: string]: UFilterItem } {
        return this._squareEvalGroupUserFilters;
    }

    get createEvalGroupBtnDisabled(): boolean {
        return !this._squareId;
    }

    get editEvalGroupBtnDisabled(): boolean {
        return (this._selectionSqrEvalGroups ?? []).length !== 1;
    }

    get deleteEvalGroupsBtnDisabled(): boolean {
        return (this._selectionSqrEvalGroups ?? []).length === 0;
    }

    get addUsersToEvalGroupBtnDisabled(): boolean {
        return this._mode !== 'modify' || (this._selectionSquareEvalGroupUsers ?? []).length === 0
            || this._selectionSquareEvalGroupUsers.findIndex(gu => gu.activeInSquareRole) !== -1;
    }

    get removeUsersFromEvalGroupBtnDisabled(): boolean {
        return this._mode !== 'modify' || (this._selectionSquareEvalGroupUsers ?? []).length === 0
            || this._selectionSquareEvalGroupUsers.findIndex(gu => !gu.activeInSquareRole) !== -1;
    }

    constructor(rootStore: RootStore, sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrSquareEvalGroupCardStore = this._rootStore.sqrSquareEvalGroupCardStore;
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
        await this.reloadSqrEvalGroupUsers();
    }

    async createEvalGroup(): Promise<void> {
        this._sqrSquareEvalGroupCardStore.title = 'Новая группа проверки';
        this._sqrSquareEvalGroupCardStore.sqrEvalGroup = {squareId: this._squareId};
        this._sqrSquareEvalGroupCardStore.squareModules = (await this._sqrSquareService.getSquareModules(this._squareId))
            .map(module => ({
                label: `${module.code} - ${module.caption}`,
                value: module.code
            } as SelectOption));
        this._sqrSquareEvalGroupCardStore.visible = true;
    }

    async editEvalGroup(): Promise<void> {
        const evalGroup = await this._sqrSquareService.getSquareEvalGroup(this._squareId, this._selectionSqrEvalGroups[0]?.id);
        if (evalGroup) {
            this._sqrSquareEvalGroupCardStore.title = `Редактирование команды (id: ${evalGroup.id})`;
            this._sqrSquareEvalGroupCardStore.squareModules = (await this._sqrSquareService.getSquareModules(this._squareId))
                .map(module => ({
                    label: `${module.code} - ${module.caption}`,
                    value: module.code
                } as SelectOption));
            evalGroup.formModules = evalGroup.modules?.split(',').map(moduleCode => moduleCode.trim())
                .filter(moduleCode => moduleCode)
                .map(moduleCode => ({...this._sqrSquareEvalGroupCardStore.squareModules.find(option => option.value === moduleCode) as SelectOption}))
            this._sqrSquareEvalGroupCardStore.sqrEvalGroup = {...evalGroup};
            this._sqrSquareEvalGroupCardStore.visible = true;
        } else {
            this._rootStore.message.error('Ошибка получения данных', `Не удалость найти команду с ID = ${this._selectionSqrEvalGroups[0].id}`);
        }
    }

    async deleteEvalGroups(): Promise<void> {
        await this._sqrSquareService.deleteEvalGroups(this._squareId, this._selectionSqrEvalGroups.map(evalGroup => evalGroup.id));
        await this.reloadSqrEvalGroups();
    }

    async toggleMode(): Promise<void> {
        this._mode = this._mode === 'view' ? 'modify' : 'view';
        await this.reloadSqrEvalGroupUsers();
    }

    async addUsersToEvalGroup(): Promise<void> {
        await this._sqrSquareService.addUsersToEvalGroup(this._squareId,
            this._selectionSquareEvalGroupUsers.map(gu => gu.id),
            this._selectionSqrEvalGroups.map(g => g.id));
        await this.reloadSqrEvalGroupUsers();
    }

    async removeUsersFromEvalGroup(): Promise<void> {
        await this._sqrSquareService.removeUsersFromEvalGroup(this._squareId,
            this._selectionSquareEvalGroupUsers.map(gu => gu.id),
            this._selectionSqrEvalGroups.map(g => g.id));
        await this.reloadSqrEvalGroupUsers();
    }

    openSetEvalGroupUserColorCard(): void {
        this.setEvalGroupUserColorCardVisible = true;
    }

    closeSetEvalGroupUserColorCard(): void {
        this.setEvalGroupUserColorCardVisible = false;
    }

    async setEvalGroupUserColor(): Promise<void> {
        await this._sqrSquareService.setColorToEvalGroupUser(this._squareId,
            this._selectionSquareEvalGroupUsers.map(gu => gu.id),
            this._selectionSqrEvalGroups.map(g => g.id),
            this._evalGroupUserColor);
        await this.reloadSqrEvalGroupUsers();
        this.evalGroupUserColor = '000';
        this.setEvalGroupUserColorCardVisible = false;
    }
}
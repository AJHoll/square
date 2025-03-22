import RootStore from "../../Root.store";
import SqrSquareService from "../../../services/SqrSquare.service";
import {makeAutoObservable} from "mobx";
import {GridApi, SelectionChangedEvent} from "ag-grid-community";
import {SqrSquareModuleDto} from "../../../dtos/SqrSquareModule.dto";
import {SqrSquareDto} from "../../../dtos/SqrSquare.dto";
import {SqrSquareModuleCardStore} from "./SqrSquareModuleCard.store";

export class SqrSquareModuleStore {
    private readonly _rootStore: RootStore;
    private readonly _sqrSquareService: SqrSquareService;
    private readonly _sqrSquareModuleCardStore: SqrSquareModuleCardStore;

    private _sqrSquareModuleGridApi: GridApi<SqrSquareModuleDto> | undefined;
    set sqrSquareModuleGridApi(value: GridApi<SqrSquareModuleDto>) {
        this._sqrSquareModuleGridApi = value;
    }

    private _squareId: SqrSquareDto['id'];
    private _selectionSqrSquareModules: SqrSquareModuleDto[] = [];

    get createSquareModuleBtnDisabled(): boolean {
        return !this._squareId;
    }

    get editSquareModuleBtnDisabled(): boolean {
        return (this._selectionSqrSquareModules ?? []).length !== 1;
    }

    get deleteSquareModulesBtnDisabled(): boolean {
        return (this._selectionSqrSquareModules ?? []).length === 0;
    }

    constructor(rootStore: RootStore, sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrSquareModuleCardStore = rootStore.sqrSquareModuleCardStore;
        this._sqrSquareService = sqrSquareService;
        makeAutoObservable(this);
    }

    async setSquareId(squareId: SqrSquareDto['id']): Promise<void> {
        const isSquareChange: boolean = this._squareId !== squareId;
        this._squareId = squareId;
        if (isSquareChange) {
            await this.reloadSqrSquareModules();
        }
    }

    async reloadSqrSquareModules(): Promise<void> {
        this._selectionSqrSquareModules = [];
        this._sqrSquareModuleGridApi?.setRowData([]);
        this._sqrSquareModuleGridApi?.showLoadingOverlay();
        if (this._squareId) {
            const data = await this._sqrSquareService.getSquareModules(this._squareId);
            this._sqrSquareModuleGridApi?.setRowData(data ?? []);
        } else {
            this._sqrSquareModuleGridApi?.setRowData([]);
        }
    }

    onSqrSquareModulesSelectionChange(event: SelectionChangedEvent<SqrSquareModuleDto>): void {
        this._selectionSqrSquareModules = event.api.getSelectedRows();
    }

    createModule(): void {
        this._sqrSquareModuleCardStore.title = 'Новая группа проверки';
        this._sqrSquareModuleCardStore.sqrSquareModule = {squareId: this._squareId};
        this._sqrSquareModuleCardStore.visible = true;
    }

    async editModule(): Promise<void> {
        const squareModule = await this._sqrSquareService.getSquareModule(this._squareId, this._selectionSqrSquareModules[0]?.id);
        if (squareModule) {
            this._sqrSquareModuleCardStore.title = `Редактирование команды (id: ${squareModule.id})`;
            this._sqrSquareModuleCardStore.sqrSquareModule = squareModule;
            this._sqrSquareModuleCardStore.visible = true;
        } else {
            this._rootStore.message.error('Ошибка получения данных', `Не удалость найти модуль с ID = ${this._selectionSqrSquareModules[0].id}`);
        }
    }

    async deleteModule(): Promise<void> {
        await this._sqrSquareService.deleteSquareModules(this._squareId, this._selectionSqrSquareModules.map(squareModule => squareModule.id));
        await this.reloadSqrSquareModules();
    }
}
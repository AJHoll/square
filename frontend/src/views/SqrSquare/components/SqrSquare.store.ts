import RootStore from "../../Root.store";
import {ColumnApi, GridApi, SelectionChangedEvent} from "ag-grid-community";
import SqrSquareCardStore from "./SqrSquareCard.store";
import SqrSquareService from "../../../services/SqrSquare.service";
import {SqrSquareDto} from "../../../dtos/SqrSquare.dto";
import {makeAutoObservable} from "mobx";
import SqrSquareUserStore from "./SqrSquareUser.store";
import SqrSquareTeamStore from "./SqrSquareTeam.store";
import SqrSquareTimerStore from "./SqrSquareTimer.store";
import SqrSquareEvalGroupStore from "./SqrSquareEvalGroup.store";
import UserService from "../../../services/User.service";

export default class SqrSquareStore {
    private readonly _rootStore: RootStore;
    private readonly _sqrSquareCardStore: SqrSquareCardStore;
    private readonly _sqrSquareUserStore: SqrSquareUserStore;
    private readonly _sqrSquareTeamStore: SqrSquareTeamStore;
    private readonly _sqrSquareTimerStore: SqrSquareTimerStore;
    private readonly _sqrSquareService: SqrSquareService;
    private readonly _sqrSquareEvalGRoupStore: SqrSquareEvalGroupStore;

    private readonly _userService: UserService;

    private _gridApi: GridApi<SqrSquareDto> | undefined;
    set gridApi(value: GridApi<SqrSquareDto>) {
        this._gridApi = value;
    }

    get gridApi(): GridApi<SqrSquareDto> {
        return this._gridApi!;
    }

    private _columnApi: ColumnApi | undefined;
    set columnApi(value: ColumnApi | undefined) {
        this._columnApi = value;
    }

    private _selectedSquareIds: SqrSquareDto['id'][] = [];
    set selectedSquareIds(value: SqrSquareDto['id'][]) {
        this._selectedSquareIds = value;
    }

    get createBtnDisabled(): boolean {
        return !this._userService.user?.roles?.includes('admin');
    }

    get editBtnDisabled(): boolean {
        return (this._selectedSquareIds ?? []).length !== 1 || (!this._userService.user?.roles.includes('admin') &&
            !this._userService.user?.roles.includes('squareManage'));
    }

    get deleteBtnDisabled(): boolean {
        return (this._selectedSquareIds ?? []).length === 0 || !this._userService.user?.roles?.includes('admin');
    }

    constructor(rootStore: RootStore, sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrSquareUserStore = rootStore.sqrSquareUserStore;
        this._sqrSquareTeamStore = rootStore.sqrSquareTeamStore;
        this._sqrSquareCardStore = rootStore.sqrSquareCardStore;
        this._sqrSquareTimerStore = rootStore.sqrSquareTimerStore;
        this._sqrSquareEvalGRoupStore = rootStore.sqrSquareEvalGroupStore;
        this._sqrSquareService = sqrSquareService;
        this._userService = rootStore.rootService.userService;
        makeAutoObservable(this);
    }

    async reloadSquares(): Promise<void> {
        const data = await this._sqrSquareService.getSquares();
        this.selectedSquareIds = [];
        this._gridApi?.deselectAll();
        if (data) {
            this._gridApi?.setRowData(data);
        } else {
            this._rootStore.message.error('Ошибка получения данных', 'Ошибка при получении списка площадок');
        }
    }

    async squareSelectionChange(event: SelectionChangedEvent<SqrSquareDto>): Promise<void> {
        this.selectedSquareIds = event.api.getSelectedRows().map(row => row.id);
        const squareId = this._selectedSquareIds.length === 1 ? this._selectedSquareIds[0] : undefined;
        await Promise.all([
            this._sqrSquareUserStore.setSquareId(squareId),
            this._sqrSquareTeamStore.setSquareId(squareId),
            this._sqrSquareTimerStore.setSquareId(squareId),
            this._sqrSquareEvalGRoupStore.setSquareId(squareId),
        ]);
    }

    createNewSquare(): void {
        this._sqrSquareCardStore.title = 'Новая площадка';
        this._sqrSquareCardStore.sqrSquare = {};
        this._sqrSquareCardStore.visible = true;
    }

    async editSquare(): Promise<void> {
        const square = await this._sqrSquareService.getSquare(this._selectedSquareIds[0]);
        if (square) {
            this._sqrSquareCardStore.title = `Редактирование площадки (id: ${square.id})`;
            this._sqrSquareCardStore.sqrSquare = square;
            this._sqrSquareCardStore.visible = true;
        } else {
            this._rootStore.message.error('Ошибка получения данных', `Не удалость найти площадку с ID = ${this._selectedSquareIds[0]}`);
        }
    }

    async deleteSquares(): Promise<void> {
        await this._sqrSquareService.deleteSquares(this._selectedSquareIds);
        await this.reloadSquares();
    }
}
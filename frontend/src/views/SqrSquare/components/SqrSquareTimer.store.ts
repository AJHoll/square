import RootStore from "../../Root.store";
import SqrSquareService from "../../../services/SqrSquare.service";
import {GridApi, SelectionChangedEvent} from "ag-grid-community";
import {makeAutoObservable} from "mobx";
import {SqrTimerDto} from "../../../dtos/SqrTimer.dto";
import {SqrSquareDto} from "../../../dtos/SqrSquare.dto";
import {UFilterItem} from "../../../components/DevsGrid/DevsGridFilterItem";

export default class SqrSquareTimerStore {
    private readonly _rootStore: RootStore;
    private readonly _sqrSquareService: SqrSquareService;

    private _sqrTimersGridApi: GridApi<SqrTimerDto> | undefined;
    set sqrTimersGridApi(value: GridApi<SqrTimerDto>) {
        this._sqrTimersGridApi = value;
    }

    private _squareId: SqrSquareDto['id'];
    private _selectionSqrTimers: SqrTimerDto[] = [];
    private _squareTimerFilters: { [p: string]: UFilterItem } = {
        fast_filter: {
            fieldName: 'fast_filter',
            fieldTitle: 'Имя команды',
            value: '',
            type: 'string'
        }
    }
    private _timerCount = 0;
    set timerCount(value: number) {
        this._timerCount = value;
    }

    get squareTimerFilters(): { [p: string]: UFilterItem } {
        return this._squareTimerFilters;
    }

    private _timerCountCardVisible = false;
    get timerCountCardVisible(): boolean {
        return this._timerCountCardVisible;
    }

    set timerCountCardVisible(value: boolean) {
        this._timerCountCardVisible = value;
    }

    private _timerCountCardType: 'all' | 'oneTimer' = 'all';
    get timerCountCardType(): "all" | "oneTimer" {
        return this._timerCountCardType;
    }

    private _timerCardHoursCount: number = 0;

    set timerCardHoursCount(value: number) {
        this._timerCardHoursCount = value;
        this.setUpTimerCount();
    }

    private _timerCardMinutesCount: number = 0;

    set timerCardMinutesCount(value: number) {
        this._timerCardMinutesCount = value;
        this.setUpTimerCount();
    }

    private _timerCardSecondsCount: number = 0;

    set timerCardSecondsCount(value: number) {
        this._timerCardSecondsCount = value;
        this.setUpTimerCount();
    }

    private _timerIntervalHandler = setInterval(() => {
        if (this._sqrTimersGridApi) {
            this._sqrTimersGridApi?.forEachNode((rowNode) => {
                if (rowNode.data?.state?.key === 'START' && (rowNode.data?.count ?? 0) > 0) {
                    rowNode.updateData({...rowNode.data, count: (rowNode.data?.count ?? 0) - 1})
                }
            })
        }
    }, 1000);

    constructor(rootStore: RootStore,
                sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrSquareService = sqrSquareService;
        makeAutoObservable(this);
    }

    setUpTimerCount(): void {
        this.timerCount = ((this._timerCardHoursCount ?? 0) * 3600) +
            ((this._timerCardMinutesCount ?? 0) * 60) +
            (this._timerCardSecondsCount ?? 0);
    }

    async setSquareId(squareId: SqrSquareDto['id']): Promise<void> {
        const isSquareChange: boolean = this._squareId !== squareId;
        this._squareId = squareId;
        if (isSquareChange) {
            await this.reloadSqrTimers();
        }
    }

    async reloadSqrTimers(): Promise<void> {
        this._selectionSqrTimers = [];
        this._sqrTimersGridApi?.setRowData([]);
        this._sqrTimersGridApi?.showLoadingOverlay();
        if (this._squareId) {
            const data = await this._sqrSquareService.getSquareTimers(this._squareId);
            this._sqrTimersGridApi?.setRowData(data ?? []);
        } else {
            this._sqrTimersGridApi?.setRowData([]);
        }
    }

    onTimerSelectionChange(event: SelectionChangedEvent<SqrTimerDto>): void {
        this._selectionSqrTimers = event.api.getSelectedRows();
    }

    async recreateTimers(): Promise<void> {
        if (this._squareId) {
            await this._sqrSquareService.recreateTimers(this._squareId);
            await this.reloadSqrTimers();
        }
    }

    setAllTimerCountBtnClicked(): void {
        this._timerCountCardType = 'all';
        this._timerCountCardVisible = true;
        this._timerCardHoursCount = 0;
        this._timerCardMinutesCount = 0;
        this._timerCardSecondsCount = 0;
    }

    setTimerCountBtnClicked(): void {
        this._timerCountCardType = 'oneTimer';
        this._timerCountCardVisible = true;
        this._timerCardHoursCount = 0;
        this._timerCardMinutesCount = 0;
        this._timerCardSecondsCount = 0;
    }

    async setTimerCount(): Promise<void> {
        if (this._squareId) {
            switch (this._timerCountCardType) {
                case "oneTimer": {
                    await this._sqrSquareService.setTimerCount(this._squareId, this._selectionSqrTimers[0].id, this._timerCount);
                    break;
                }
                case "all": {
                    await this._sqrSquareService.setAllTimerCount(this._squareId, this._timerCount);
                    break;
                }
            }
            await this.reloadSqrTimers();
        }
        this.timerCountCardVisible = false;
    }
}
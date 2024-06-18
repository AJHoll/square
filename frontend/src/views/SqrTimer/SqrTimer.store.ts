import RootStore from "../Root.store";
import {makeAutoObservable} from "mobx";
import SqrSquareService from "../../services/SqrSquare.service";
import {SelectOption} from "@ajholl/devsuikit";
import React from "react";
import DevsSelect from "@ajholl/devsuikit/dist/DevsSelect";
import {SqrTimerDto} from "../../dtos/SqrTimer.dto";

export class SqrTimerStore {
    private readonly _rootStore: RootStore;
    private readonly _sqrSquareService: SqrSquareService;

    private _selectSquareRef: React.RefObject<DevsSelect> | undefined;
    private _mainTimerChangeClass: string = '';
    get mainTimerChangeClass(): string {
        return this._mainTimerChangeClass;
    }

    set mainTimerChangeClass(value: string) {
        this._mainTimerChangeClass = value;
    }

    private _mainTimerIdx: number = 0;
    set mainTimerIdx(value: number) {
        if (this._mainTimerIdx !== value) {
            this._mainTimerIdx = value;
        }
    }

    get mainTimerIdx(): number {
        return this._mainTimerIdx;
    }

    private _syncTimerInterval: NodeJS.Timer | undefined;
    private _changeMainTimerInterval: NodeJS.Timer | undefined;

    private _onlyAvailable: boolean = false;
    get onlyAvailable(): boolean {
        return this._onlyAvailable;
    }

    set onlyAvailable(value: boolean) {
        this._onlyAvailable = value;
    }

    private _squares: SelectOption[] = [];
    get squares(): SelectOption[] {
        return this._squares;
    }

    set squares(value: SelectOption[]) {
        this._squares = value;
    }

    private _selectedSquare: SelectOption | undefined;
    get selectedSquare(): SelectOption | undefined {
        return this._selectedSquare;
    }

    set selectedSquare(value: SelectOption | undefined) {
        this._selectedSquare = value;
        if (this._selectSquareRef) {
            this._selectSquareRef.current?.setState({cValue: value});
        }
        this.syncTimers().then();
    }

    private _timers: SqrTimerDto[] = [];
    get timers(): SqrTimerDto[] {
        return this._timers;
    }

    set timers(value: SqrTimerDto[]) {
        this._timers = value;
    }

    get mainTimer(): SqrTimerDto {
        return this.timers[this._mainTimerIdx];
    }

    get otherTimers(): SqrTimerDto[] {
        return this.timers.filter((timer, index) => index !== this._mainTimerIdx);
    }

    private _onlyMainTimer: boolean = false;
    get onlyMainTimer(): boolean {
        return this._onlyMainTimer;
    }

    set onlyMainTimer(value: boolean) {
        this._onlyMainTimer = value;
    }

    constructor(rootStore: RootStore,
                sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrSquareService = sqrSquareService;
        makeAutoObservable(this);
    }

    async init(selectRef: React.RefObject<DevsSelect>): Promise<void> {
        this._selectSquareRef = selectRef;
        this.squares = (await this._sqrSquareService.getSquares()).map((square) => ({
            label: square.caption!,
            value: square.id!
        }));
        this.selectedSquare = this.squares[this._mainTimerIdx];
        await this.syncTimers();
        this._syncTimerInterval = setInterval(async (): Promise<void> => {
            await this.syncTimers();
        }, 1000);
        this._changeMainTimerInterval = setInterval(() => this.changeMainTimer(), 10000);
    }

    dispatch(): void {
        if (this._syncTimerInterval) {
            clearInterval(this._syncTimerInterval);
        }
        if (this._changeMainTimerInterval) {
            clearInterval(this._changeMainTimerInterval);
        }
    }

    async syncTimers(): Promise<void> {
        if (this.selectedSquare?.value) {
            if (!this._onlyMainTimer) {
                this.timers = (await this._sqrSquareService.getSquareTimers(+this.selectedSquare.value))
                    .filter(timer => timer.teamId !== undefined && timer.state?.key !== 'STOP');
            } else {
                this.timers = (await this._sqrSquareService.getSquareTimers(+this.selectedSquare.value)).filter(timer => timer.teamId === undefined)
                this.mainTimerIdx = 0;
            }
        }
    }

    changeMainTimer(): void {
        if ((this.timers ?? []).length > 0 && !(this._onlyMainTimer)) {
            this.mainTimerChangeClass = 'timer_hiding';
            setTimeout(() => {
                if (this._mainTimerIdx === this.timers.length - 1) {
                    this.mainTimerIdx = 0;
                } else {
                    this.mainTimerIdx += 1;
                }
                this.mainTimerChangeClass = '';
            }, 500);
        }
    }
}
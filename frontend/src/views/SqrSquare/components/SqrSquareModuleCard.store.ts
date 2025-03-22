import RootStore from "../../Root.store";
import SqrSquareService from "../../../services/SqrSquare.service";
import {makeAutoObservable} from "mobx";
import {SqrSquareModuleDto} from "../../../dtos/SqrSquareModule.dto";

export class SqrSquareModuleCardStore {
    private readonly _rootStore: RootStore;
    private readonly _sqrSquareService: SqrSquareService;


    private _visible: boolean = false;
    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
    }

    private _title: string = '';
    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    private _loading: boolean = false;
    get loading(): boolean {
        return this._loading;
    }

    set loading(value: boolean) {
        this._loading = value;
    }

    private _cardItemWasChanged: boolean = false;
    get cardItemWasChanged(): boolean {
        return this._cardItemWasChanged;
    }

    set cardItemWasChanged(value: boolean) {
        this._cardItemWasChanged = value;
    }

    private _sqrSquareModule: SqrSquareModuleDto = {};

    get sqrSquareModule(): SqrSquareModuleDto {
        return this._sqrSquareModule;
    }

    set sqrSquareModule(value: SqrSquareModuleDto) {
        this._sqrSquareModule = value;
    }

    constructor(rootStore: RootStore,
                sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrSquareService = sqrSquareService;
        makeAutoObservable(this);
    }

    setCode(code: SqrSquareModuleDto['code']): void {
        this._sqrSquareModule.code = code;
        this._cardItemWasChanged = true;
    }

    setCaption(caption: SqrSquareModuleDto['caption']): void {
        this._sqrSquareModule.caption = caption;
        this._cardItemWasChanged = true;
    }

    setEvaluating(evaluating: SqrSquareModuleDto['evaluating']): void {
        this._sqrSquareModule.evaluating = evaluating;
        this._cardItemWasChanged = true;
    }

    close(): void {
        this._cardItemWasChanged = false;
        this._sqrSquareModule = {};
        this._loading = false;
        this._visible = false;
    }

    async save(): Promise<void> {
        if (this._sqrSquareModule.id) {
            await this._sqrSquareService.editSquareModule(this._sqrSquareModule.squareId, this._sqrSquareModule.id, this._sqrSquareModule);
        } else {
            await this._sqrSquareService.createSquareModule(this._sqrSquareModule.squareId, this._sqrSquareModule);
        }
        this.close();
        await this._rootStore.sqrSquareModuleStore.reloadSqrSquareModules();
    }
}
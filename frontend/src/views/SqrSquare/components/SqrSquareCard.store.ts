import RootStore from "../../Root.store";
import {makeAutoObservable} from "mobx";
import {SqrSquareDto} from "../../../dtos/SqrSquare.dto";
import SqrSquareService from "../../../services/SqrSquare.service";

export default class SqrSquareCardStore {
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


    private _sqrSquare: SqrSquareDto = {};
    get sqrSquare(): SqrSquareDto {
        return this._sqrSquare;
    }

    set sqrSquare(value: SqrSquareDto) {
        this._sqrSquare = value;
    }

    constructor(rootStore: RootStore, sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrSquareService = sqrSquareService;
        makeAutoObservable(this);
    }

    setName(name: SqrSquareDto['name']): void {
        this._sqrSquare.name = name;
        this._cardItemWasChanged = true;
    }

    setCaption(caption: SqrSquareDto['caption']): void {
        this._sqrSquare.caption = caption;
        this._cardItemWasChanged = true;
    }

    setDescription(description: SqrSquareDto['description']): void {
        this._sqrSquare.description = description;
        this._cardItemWasChanged = true;
    }

    close(): void {
        this._cardItemWasChanged = false;
        this._sqrSquare = {};
        this._loading = false;
        this._visible = false;
    }

    async save(): Promise<void> {
        if (this._sqrSquare.id) {
            await this._sqrSquareService.editSquare(this._sqrSquare.id, this._sqrSquare);
        } else {
            await this._sqrSquareService.createSquare(this._sqrSquare);
        }
        this.close();
        await this._rootStore.sqrSquareStore.reloadSquares();
    }
}
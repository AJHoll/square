import RootStore from "../../Root.store";
import SqrSquareService from "../../../services/SqrSquare.service";
import {SqrTeamDto} from "../../../dtos/SqrTeam.dto";
import {makeAutoObservable} from "mobx";

export default class SqrSquareTeamCardStore {
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


    private _sqrSquareTeam: SqrTeamDto = {};

    get sqrTeam(): SqrTeamDto {
        return this._sqrSquareTeam;
    }

    set sqrTeam(value: SqrTeamDto) {
        this._sqrSquareTeam = value;
    }

    constructor(rootStore: RootStore,
                sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrSquareService = sqrSquareService;
        makeAutoObservable(this);
    }


    setName(name: SqrTeamDto['name']): void {
        this._sqrSquareTeam.name = name;
        this._cardItemWasChanged = true;
    }

    setCaption(caption: SqrTeamDto['caption']): void {
        this._sqrSquareTeam.caption = caption;
        this._cardItemWasChanged = true;
    }

    setDescription(description: SqrTeamDto['description']): void {
        this._sqrSquareTeam.description = description;
        this._cardItemWasChanged = true;
    }

    close(): void {
        this._cardItemWasChanged = false;
        this._sqrSquareTeam = {};
        this._loading = false;
        this._visible = false;
    }

    async save(): Promise<void> {
        if (this._sqrSquareTeam.id) {
            await this._sqrSquareService.editTeam(this._sqrSquareTeam.squareId, this._sqrSquareTeam.id, this._sqrSquareTeam);
        } else {
            await this._sqrSquareService.createTeam(this._sqrSquareTeam.squareId, this._sqrSquareTeam);
        }
        this.close();
        await this._rootStore.sqrSquareTeamStore.reloadSqrTeams();
    }
}
import RootStore from "../../Root.store";
import {makeAutoObservable} from "mobx";
import AdmUserService from "../../../services/AdmUser.service";
import {AdmUserDto} from "../../../dtos/AdmUser.dto";

export default class AdmUserCardStore {
    private readonly _rootStore: RootStore;
    private readonly _admUserService: AdmUserService;

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

    private _admUser: AdmUserDto = {};
    get admUser(): AdmUserDto {
        return this._admUser;
    }

    set admUser(value: AdmUserDto) {
        this._admUser = value;
    }

    constructor(rootStore: RootStore,
                admUserService: AdmUserService) {
        this._rootStore = rootStore;
        this._admUserService = admUserService;
        makeAutoObservable(this);
    }

    setName(name: AdmUserDto['name']): void {
        this._admUser.name = name;
        this._cardItemWasChanged = true;
    }

    setCaption(caption: AdmUserDto['caption']): void {
        this._admUser.caption = caption;
        this._cardItemWasChanged = true;
    }

    setPassword(password: AdmUserDto['password']): void {
        this._admUser.password = password;
        this._cardItemWasChanged = true;
    }

    close(): void {
        this._cardItemWasChanged = false;
        this._admUser = {};
        this._loading = false;
        this._visible = false;
    }

    async save(): Promise<void> {
        if (this.validate()) {
            if (this._admUser.id) {
                await this._admUserService.editUser(this._admUser.id, this._admUser);
            } else {
                await this._admUserService.createUser(this._admUser);
            }
            this.close();
            await this._rootStore.admUserStore.reloadUsers();
        } else {
            this._rootStore.message.error('Ошибка валидации формы',
                'Одно, или несколько полей формы не заполнены, или заполнены не верно');
        }

    }

    validate(): boolean {
        return !(!this._admUser.name ||
            !this._admUser.caption ||
            (!this._admUser.id && !this._admUser.password));
    }
}
import RootStore from "../../Root.store";
import SqrRoleService from "../../../services/SqrRole.service";
import {SqrRoleDto} from "../../../dtos/SqrRole.dto";
import {makeAutoObservable} from "mobx";

export class SqrRoleCardStore {
    private readonly _rootService: RootStore;
    private readonly _sqrRoleService: SqrRoleService;
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


    private _sqrRole: SqrRoleDto = {};

    get sqrRole(): SqrRoleDto {
        return this._sqrRole;
    }

    set sqrRole(value: SqrRoleDto) {
        this._sqrRole = value;
    }

    constructor(rootStore: RootStore, sqrRoleService: SqrRoleService) {
        this._rootService = rootStore;
        this._sqrRoleService = sqrRoleService;
        makeAutoObservable(this);
    }

    setName(name: SqrRoleDto['name']): void {
        this._sqrRole.name = name;
        this._cardItemWasChanged = true;
    }

    setCaption(caption: SqrRoleDto['caption']): void {
        this._sqrRole.caption = caption;
        this._cardItemWasChanged = true;
    }

    setDescription(description: SqrRoleDto['description']): void {
        this._sqrRole.description = description;
        this._cardItemWasChanged = true;
    }

    close(): void {
        this._cardItemWasChanged = false;
        this._sqrRole = {};
        this._loading = false;
        this._visible = false;
    }

    async save(): Promise<void> {
        if (this._sqrRole.id) {
            await this._sqrRoleService.editRole(this._sqrRole.id, this._sqrRole);
        } else {
            await this._sqrRoleService.createRole(this._sqrRole);
        }
        this.close();
        await this._rootService.sqrRoleStore.reloadRoles();
    }
}
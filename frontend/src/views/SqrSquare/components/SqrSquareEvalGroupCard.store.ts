import RootStore from "../../Root.store";
import SqrSquareService from "../../../services/SqrSquare.service";
import {makeAutoObservable} from "mobx";
import {SqrSquareEvalGroupDto} from "../../../dtos/SqrSquareEvalGroup.dto";
import {SelectOption} from "@ajholl/devsuikit";

export class SqrSquareEvalGroupCardStore {
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

    private _sqrEvalGroup: SqrSquareEvalGroupDto = {};

    get sqrEvalGroup(): SqrSquareEvalGroupDto {
        return this._sqrEvalGroup;
    }

    set sqrEvalGroup(value: SqrSquareEvalGroupDto) {
        this._sqrEvalGroup = value;
    }

    private _squareModules: SelectOption[] = [];
    get squareModules(): SelectOption[] {
        return this._squareModules;
    }

    set squareModules(value: SelectOption[]) {
        this._squareModules = value;
    }


    constructor(rootStore: RootStore,
                sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrSquareService = sqrSquareService;
        makeAutoObservable(this);
    }

    setCode(code: SqrSquareEvalGroupDto['code']): void {
        this._sqrEvalGroup.code = code;
        this._cardItemWasChanged = true;
    }

    setCaption(caption: SqrSquareEvalGroupDto['caption']): void {
        this._sqrEvalGroup.caption = caption;
        this._cardItemWasChanged = true;
    }

    setModules(modules: SqrSquareEvalGroupDto['modules']): void {
        this._sqrEvalGroup.modules = modules;
        this._cardItemWasChanged = true;
    }

    setFormModule(module: SelectOption, newValue: SelectOption) {
        module.label = newValue?.label;
        module.value = newValue?.value;
        this.refreshModulesField();
    }

    removeFormModule(module: SelectOption) {
        this._sqrEvalGroup.formModules = (this._sqrEvalGroup.formModules ?? []).filter(formModule => formModule !== module);
        this.refreshModulesField();
    }

    addNewModulesBtnClick(): void {
        this._sqrEvalGroup.formModules = [...(this._sqrEvalGroup?.formModules ?? []), {
            label: '',
            value: ''
        } as SelectOption];
    }

    close(): void {
        this._cardItemWasChanged = false;
        this._sqrEvalGroup = {};
        this._squareModules = [];
        this._loading = false;
        this._visible = false;
    }

    async save(): Promise<void> {
        if (this._sqrEvalGroup.id) {
            await this._sqrSquareService.editEvalGroup(this._sqrEvalGroup.squareId, this._sqrEvalGroup.id, this._sqrEvalGroup);
        } else {
            await this._sqrSquareService.createEvalGroup(this._sqrEvalGroup.squareId, this._sqrEvalGroup);
        }
        this.close();
        await this._rootStore.sqrSquareEvalGroupStore.reloadSqrEvalGroups();
    }

    private refreshModulesField(): void {
        this.setModules((this._sqrEvalGroup.formModules ?? [])
            .filter(formModule => !!formModule?.value)
            .map(formModule => formModule.value).join(','))
    }
}
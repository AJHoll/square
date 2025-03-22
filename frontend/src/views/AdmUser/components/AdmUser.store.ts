import RootStore from "../../Root.store";
import {makeAutoObservable} from "mobx";
import AdmUserService from "../../../services/AdmUser.service";
import {ColumnApi, GridApi, SelectionChangedEvent} from "ag-grid-community";
import {AdmUserDto} from "../../../dtos/AdmUser.dto";
import AdmUserCardStore from "./AdmUserCard.store";
import AdmUserGroupStore from "./AdmUserGroup.store";
import {saveAs} from "file-saver";
import React from "react";
import UserService from "../../../services/User.service";

export default class AdmUserStore {
    private readonly _rootStore: RootStore;
    private readonly _admUserCardStore: AdmUserCardStore;
    private readonly _admUserGroupStore: AdmUserGroupStore;
    private readonly _admUserService: AdmUserService;
    private readonly _userService: UserService;


    private _gridApi: GridApi<AdmUserDto> | undefined;
    set gridApi(value: GridApi<AdmUserDto>) {
        this._gridApi = value;
    }

    get gridApi(): GridApi<AdmUserDto> {
        return this._gridApi!;
    }

    private _columnApi: ColumnApi | undefined;
    set columnApi(value: ColumnApi | undefined) {
        this._columnApi = value;
    }

    private _selectedUserIds: AdmUserDto['id'][] = [];

    set selectedUserIds(value: AdmUserDto['id'][]) {
        this._selectedUserIds = value;
    }

    get editBtnDisabled(): boolean {
        return (this._selectedUserIds ?? []).length !== 1 || this._selectedUserIds.includes(1);
    }

    get deleteBtnDisabled(): boolean {
        return (this._selectedUserIds ?? []).length === 0 || this._selectedUserIds.includes(1) ||
            !this._userService.user?.roles?.includes('admin');
    }

    constructor(rootStore: RootStore,
                admUserService: AdmUserService) {
        this._rootStore = rootStore;
        this._admUserCardStore = rootStore.admUserCardStore;
        this._admUserGroupStore = rootStore.admUserGroupStore;
        this._admUserService = admUserService;
        this._userService = this._rootStore.rootService.userService;
        makeAutoObservable(this);
    }

    async reloadUsers(): Promise<void> {
        const data = await this._admUserService.getUsers();
        this.selectedUserIds = [];
        this._gridApi?.deselectAll();
        if (data) {
            this._gridApi?.setRowData(data);
        } else {
            this._rootStore.message.error('Ошибка получения данных', 'Ошибка при получении списка пользователей');
        }
    }

    async userSelectionChange(event: SelectionChangedEvent<AdmUserDto>): Promise<void> {
        this.selectedUserIds = event.api.getSelectedRows().map(row => row.id);
        await this._admUserGroupStore.setUserId(this._selectedUserIds.length === 1 ? this._selectedUserIds[0] : undefined);
    }

    async createNewUser(): Promise<void> {
        this._admUserCardStore.title = 'Новый пользователь';
        this._admUserCardStore.admUser = {};
        this._admUserCardStore.visible = true;
    }

    async editUser(): Promise<void> {
        const user = await this._admUserService.getUser(this._selectedUserIds[0]);
        if (user) {
            this._admUserCardStore.title = `Редактирование группы (id: ${user.id})`;
            this._admUserCardStore.admUser = user;
            this._admUserCardStore.visible = true;
        } else {
            this._rootStore.message.error('Ошибка получения данных',
                `Не удалость найти пользователя с ID = ${this._selectedUserIds[0]}`);
        }
    }

    async deleteUsers(): Promise<void> {
        await this._admUserService.deleteUsers(this._selectedUserIds);
        await this.reloadUsers();
    }

    async downloadImportTemplate(): Promise<void> {
        const fileArrayBuffer = await this._admUserService.downloadImportTemplate();
        if (fileArrayBuffer) {
            saveAs(new Blob([fileArrayBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
            }), 'Скверъ__шаблон_импорта_пользователей');
        }
    }

    async importUser(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const file = event.target.files?.item(0);
        if (file) {
            await this._admUserService.importUser(file);
            await this.reloadUsers();
        }
    }
}
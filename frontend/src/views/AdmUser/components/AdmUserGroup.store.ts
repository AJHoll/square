import RootStore from "../../Root.store";
import {makeAutoObservable} from "mobx";
import AdmUserService from "../../../services/AdmUser.service";
import AdmGroupService from "../../../services/AdmGroup.service";
import {GridApi, SelectionChangedEvent} from "ag-grid-community";
import {AdmUserGroupDto} from "../../../dtos/AdmUserGroup.dto";
import {AdmGroupDto} from "../../../dtos/AdmGroup.dto";
import {AdmUserDto} from "../../../dtos/AdmUser.dto";

export default class AdmUserGroupStore {
    private readonly _rootStore: RootStore;
    private readonly _admUserService: AdmUserService;
    private readonly _admGroupService: AdmGroupService;

    private _userId: AdmUserDto['id'];
    private _selectionUserGroups: AdmUserGroupDto[] = [];
    private _selectionGroups: AdmGroupDto[] = [];

    private _userGroupGridApi: GridApi<AdmUserGroupDto> | undefined;

    set userGroupGridApi(value: GridApi<AdmUserGroupDto>) {
        this._userGroupGridApi = value;
    }

    private _groupGridApi: GridApi<AdmGroupDto> | undefined;
    set groupGridApi(value: GridApi<AdmGroupDto>) {
        this._groupGridApi = value;
    }

    get addGroupToUserBtnDisabled(): boolean {
        return (this._selectionGroups ?? []).length === 0 || this._userId === 1;
    }

    get removeGroupFromUserBtnDisabled(): boolean {
        return (this._selectionUserGroups ?? []).length === 0 || this._userId === 1;
    }

    constructor(rootStore: RootStore,
                admUserService: AdmUserService,
                admGroupService: AdmGroupService) {
        this._rootStore = rootStore;
        this._admUserService = admUserService;
        this._admGroupService = admGroupService;
        makeAutoObservable(this);
    }

    async setUserId(userId: AdmUserDto['id']): Promise<void> {
        const isUserChange: boolean = this._userId !== userId;
        this._userId = userId;
        if (isUserChange) {
            await Promise.all([this.reloadUserGroups(), this.reloadGroups()]);
        }
    }

    async reloadUserGroups(): Promise<void> {
        this._selectionUserGroups = [];
        this._userGroupGridApi?.setRowData([]);
        this._userGroupGridApi?.showLoadingOverlay();
        if (this._userId) {
            const data = await this._admUserService.getUserGroups(this._userId);
            this._userGroupGridApi?.setRowData(data ?? []);
        } else {
            this._userGroupGridApi?.setRowData([]);
        }
    }

    async reloadGroups(): Promise<void> {
        this._selectionGroups = [];
        this._groupGridApi?.setRowData([]);
        this._groupGridApi?.showLoadingOverlay();
        if (this._userId) {
            const data = await this._admGroupService.getGroupsExcludeUser(this._userId);
            this._groupGridApi?.setRowData(data ?? []);
        } else {
            this._groupGridApi?.setRowData([]);
        }
    }

    userGroupSelectionChange(event: SelectionChangedEvent<AdmUserGroupDto>): void {
        this._selectionUserGroups = event.api.getSelectedRows();
    }

    groupSelectionChange(event: SelectionChangedEvent<AdmGroupDto>): void {
        this._selectionGroups = event.api.getSelectedRows();
    }

    async addGroupToUser(): Promise<void> {
        await this._admUserService.addGroupsToUser(this._userId, this._selectionGroups);
        await Promise.all([this.reloadUserGroups(), this.reloadGroups()]);
    }

    async removeGroupFromUser(): Promise<void> {
        await this._admUserService.removeGroupsFromUser(this._userId, this._selectionUserGroups);
        await Promise.all([this.reloadUserGroups(), this.reloadGroups()]);
    }
}
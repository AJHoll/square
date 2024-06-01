import RootStore from "../Root.store";
import {makeAutoObservable} from "mobx";
import AdmUserService from "../../services/AdmUser.service";
import {AdmUserDto} from "../../dtos/AdmUser.dto";
import {SqrTimerDto} from "../../dtos/SqrTimer.dto";

export default class ProfileStore {

    private readonly _rootStore: RootStore;
    private readonly _admUserService: AdmUserService;

    private _syncTimerInterval: NodeJS.Timer | undefined;

    private _user: AdmUserDto | undefined;
    get user(): AdmUserDto | undefined {
        return this._user;
    }

    set user(value: AdmUserDto | undefined) {
        this._user = value;
    }

    private _mode: 'view' | 'edit' = 'view';
    get mode(): "view" | "edit" {
        return this._mode;
    }

    set mode(value: "view" | "edit") {
        this._mode = value;
    }

    private _timer: SqrTimerDto | undefined;
    get timer(): SqrTimerDto | undefined {
        return this._timer;
    }

    set timer(value: SqrTimerDto | undefined) {
        this._timer = value;
    }

    constructor(rootStore: RootStore,
                admUserService: AdmUserService) {
        this._rootStore = rootStore;
        this._admUserService = admUserService;
        makeAutoObservable(this);
    }

    async init(): Promise<void> {
        this.user = await this._admUserService.getUser(this._rootStore.rootService.userService.user?.id);
        await this.syncTimer();
        this._syncTimerInterval = setInterval(async (): Promise<void> => {
            await this.syncTimer();
        }, 1000);
    }

    setUserCaption(caption: AdmUserDto['caption']): void {
        this._user!.caption = caption;
    }

    setUserPassword(password: AdmUserDto['password']): void {
        this._user!.password = password;
    }

    async changeUserCaptionAndPassword(): Promise<void> {
        if (this._user) {
            await this._admUserService.changeUserCaptionAndPassword(this._user);
            this._rootStore.message.success('Данные успешно сохранены', 'Для обновления данных в главном меню, пожалуйста, перезайдите в приложение.');
        }
        this.mode = 'view';
    }

    async syncTimer(): Promise<void> {
        this.timer = await this._admUserService.getMyTimer();
    }

    dispatch(): void {
        if (this._syncTimerInterval) {
            clearInterval(this._syncTimerInterval);
        }
    }

}
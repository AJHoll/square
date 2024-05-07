import RootStore from '../Root.store';
import {makeAutoObservable} from 'mobx';
import {MainMenuGroupDto} from '../../dtos/MainMenuGroup.dto';
import MainMenuService from '../../services/MainMenu.service';
import {DevsMenuItem} from "@ajholl/devsuikit";
import {RouteComponentProps} from "react-router-dom";
import {MenuItemCommandEvent} from "primereact/menuitem";

export default class MainMenuStore {
    private readonly rootStore: RootStore;
    private readonly mainMenuService: MainMenuService;

    private _menu: MainMenuGroupDto[] = [];
    get menu(): MainMenuGroupDto[] {
        return this._menu ?? [];
    }

    set menu(value: MainMenuGroupDto[]) {
        this._menu = value;
    }

    private _menubarItems: DevsMenuItem[] = [];

    get menubarItems(): DevsMenuItem[] {
        return this._menubarItems;
    }

    set menubarItems(value: DevsMenuItem[]) {
        this._menubarItems = value;
    }

    private _menuFilter: string = '';
    get menuFilter(): string {
        return this._menuFilter;
    }

    set menuFilter(value: string) {
        this._menuFilter = value;
    }

    constructor(rootStore: RootStore, mainMenuService: MainMenuService) {
        this.rootStore = rootStore;
        this.mainMenuService = mainMenuService;
        makeAutoObservable(this);
    }

    async reloadMainMenu(): Promise<void> {
        this.menu = await this.mainMenuService.getMainMenu(this._menuFilter);
    }

    async initMenubar(props: RouteComponentProps): Promise<void> {
        const menu: MainMenuGroupDto[] = await this.mainMenuService.getMainMenu('');
        this.menubarItems = (menu ?? []).map((group) => ({
            label: group.title,
            icon: group.icon,
            items: group.items.map((item) => ({
                label: item.title,
                icon: item.icon,
                command: (event: MenuItemCommandEvent) => (props.history.push(item.url))
            }))
        }));
    }
}
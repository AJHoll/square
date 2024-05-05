import RootStore from '../Root.store';
import { makeAutoObservable } from 'mobx';
import { MainMenuGroupDto } from '../../dtos/MainMenuGroup.dto';
import MainMenuService from '../../services/MainMenu.service';

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
}
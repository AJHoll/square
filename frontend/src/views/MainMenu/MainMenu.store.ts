import RootStore from '../Root.store';
import { makeAutoObservable } from 'mobx';
import { MainMenuGroupDto } from '../../dtos/MainMenuGroup.dto';
import MainMenuService from '../../services/MainMenu.service';

export default class MainMenuStore {
  private readonly rootStore: RootStore;
  private readonly mainMenuService: MainMenuService;

  private _menu: MainMenuGroupDto[] = [
    /*{
      id: 1,
      title: 'Мокнутая группа 1',
      items: [
        {
          id: 11,
          title: 'Тестовый айтем 11',
          icon: 'lni lni-file',
          url: 'test11',
        },
        {
          id: 12,
          title: 'Тестовый айтем 12',
          url: 'test12',
        },
      ],
      order: 1,
    },
    {
      id: 2,
      title: 'Мокнутая группа 2',
      items: [
        {
          id: 21,
          title: 'Тестовый айтем 21',
          url: 'test21',
        },
      ],
      order: 2,
    },*/

  ];
  get menu(): MainMenuGroupDto[] {
    return this._menu ?? [];
  }

  set menu(value: MainMenuGroupDto[]) {
    this._menu = value;
  }

  constructor(rootStore: RootStore, mainMenuService: MainMenuService) {
    this.rootStore = rootStore;
    this.mainMenuService = mainMenuService;
    makeAutoObservable(this);
  }

  async reloadMainMenu(): Promise<void> {
    this.menu = await this.mainMenuService.getMainMenu();
  }
}
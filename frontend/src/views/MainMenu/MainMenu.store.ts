import RootStore from '../Root.store';
import { makeAutoObservable } from 'mobx';
import { MainMenuGroupDto } from '../../dtos/MainMenuGroup.dto';

export default class MainMenuStore {
  rootStore: RootStore;

  private _menu: MainMenuGroupDto[] = [
    {
      id: 1,
      title: 'Мокнутая группа 1',
      items: [
        {
          id: 11,
          title: 'Тестовый айтем 11',
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
    },

  ];
  get menu(): MainMenuGroupDto[] {
    return this._menu;
  }

  set menu(value: MainMenuGroupDto[]) {
    this._menu = value;
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
}
import { makeAutoObservable } from 'mobx';
import { UserDto } from '../../dtos/User.dto';
import UserService from '../../services/User.service';
import RootStore from '../Root.store';

export default class AuthStore {
  rootStore: RootStore;
  userService: UserService;
  username: string = '';
  password: string = '';
  userLocalStorageKey: string = 'devs.auth.user';

  get isAuth(): boolean {
    const userValue = localStorage.getItem(this.userLocalStorageKey);
    if (userValue) {
      try {
        const user: UserDto = JSON.parse(userValue);
        if (user.expiredDate) {
          return user.expiredDate >= new Date();
        }
        return false;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.userService = this.rootStore.rootService.userService;
    makeAutoObservable(this)
  }

  async auth(): Promise<void> {
    try {
      const user = await this.userService.auth(this.username, this.password);
      sessionStorage.setItem(this.userLocalStorageKey, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }
}

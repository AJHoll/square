import { makeAutoObservable } from 'mobx';
import RootStore from '../Root.store';
import UserService from '../../services/User.service';
import AuthService from '../../services/Auth.service';
import { AuthView } from './Auth.view';

export default class AuthStore {
  rootStore: RootStore;
  authService: AuthService;
  userService: UserService;
  username: string = '';
  password: string = '';

  get isLogin(): boolean {
    if (!this.userService.user) {
      this.authService.checkAndParseToken();
    }
    return !!this.userService.user?.username;
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.userService = this.rootStore.rootService.userService;
    this.authService = this.rootStore.rootService.authService;
    makeAutoObservable(this)
  }

  async login(context: AuthView): Promise<void> {
    try {
      await this.authService.login(this.username, this.password);
      context.props.history.push("/");
    } catch (e) {
      console.error(e);
    }
  }
}

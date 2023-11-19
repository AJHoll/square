import AuthStore from './Auth/Auth.store';
import RootService from '../services/Root.service';
import MainMenuStore from './MainMenu/MainMenu.store';

export default class RootStore {
  readonly projectName = '[Скверъ]';
  rootService: RootService = new RootService();
  authStore: AuthStore = new AuthStore(this);
  mainMenuStore: MainMenuStore = new MainMenuStore(this);
}
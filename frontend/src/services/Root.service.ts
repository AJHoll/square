import UserService from './User.service';
import AuthService from './Auth.service';
import MainMenuService from './MainMenu.service';

export default class RootService {
  restUrl: string = 'http://localhost:1024'; // TODO: Переделать потом на config.json в assets
  userService: UserService = new UserService(this);
  authService: AuthService = new AuthService(this);
  mainMenuService: MainMenuService = new MainMenuService(this);
}
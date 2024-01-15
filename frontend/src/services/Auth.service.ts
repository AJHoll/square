import RootService from './Root.service';
import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import UserService from './User.service';

export default class AuthService {
  private readonly _rootService: RootService;
  private readonly _userService: UserService;
  private readonly _restPath: string;
  private readonly _squareTokenName = 'square-token';

  constructor(rootService: RootService) {
    this._rootService = rootService;
    this._userService = rootService.userService;
    this._restPath = `${this._rootService.restUrl}/auth`;
    makeAutoObservable(this);
    this.setHeaders();

    axios.interceptors.response.use(response => {
      return response;
    }, error => {
      if (error.response.status === 401) {
        this.logout();
      }
      return error;
    });
  }

  async login(username: string, password: string): Promise<void> {
    const response = await axios.post<{ access_token: string }>(`${this._restPath}/login`, { username, password });
    localStorage.setItem(this._squareTokenName, response.data.access_token);
    this.checkAndParseToken();
    this.setHeaders();
  }

  logout(): void {
    localStorage.setItem(this._squareTokenName, 'null');
    this._userService.user = undefined;
  }

  checkAndParseToken(): void {
    const token = localStorage.getItem(this._squareTokenName);
    if (!token || token === 'null') {
      return;
    }
    const base64Url: string = token.split(".")[1];
    const base64: string = base64Url.replace("-", "+").replace("_", "/");
    this._userService.user = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
  }

  setHeaders() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(this._squareTokenName)}`;
  }
}
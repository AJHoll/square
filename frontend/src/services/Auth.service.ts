import RootService from './Root.service';
import { makeAutoObservable } from 'mobx';
import axios from 'axios';

export default class AuthService {
  rootService: RootService;
  private readonly restPath: string;
  private readonly squareTokenName = 'square-token';

  constructor(rootService: RootService) {
    this.rootService = rootService;
    this.restPath = `${this.rootService.restUrl}/auth`;
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
    const response = await axios.post<{ access_token: string }>(`${this.restPath}/login`, { username, password });
    localStorage.setItem(this.squareTokenName, response.data.access_token);
    this.checkAndParseToken();
    this.setHeaders();
  }

  logout(): void {
    localStorage.setItem(this.squareTokenName, 'null');
    this.rootService.userService.user = undefined;
  }

  checkAndParseToken(): void {
    const token = localStorage.getItem(this.squareTokenName);
    if (!token || token === 'null') {
      return;
    }
    const base64Url: string = token.split(".")[1];
    const base64: string = base64Url.replace("-", "+").replace("_", "/");
    this.rootService.userService.user = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
  }

  setHeaders() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(this.squareTokenName)}`;
  }
}
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
  }

  async login(username: string, password: string): Promise<void> {
    try {
      const response = await axios.post<{ access_token: string }>(`${this.restPath}/login`, { username, password });
      localStorage.setItem(this.squareTokenName, response.data.access_token);
      this.checkAndParseToken();
    } catch (e) {
      throw e;
    }
  }

  async logout(): Promise<void> {
    localStorage.setItem(this.squareTokenName, 'null');
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
}
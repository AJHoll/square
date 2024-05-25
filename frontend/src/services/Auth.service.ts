import RootService from './Root.service';
import {makeAutoObservable} from 'mobx';
import axios from 'axios';
import UserService from './User.service';

export default class AuthService {
    private readonly _rootService: RootService;
    private readonly _userService: UserService;
    private readonly _squareTokenName = 'square-token';

    get restPath(): string {
        return `${this._rootService.restUrl}/auth`;
    }

    constructor(rootService: RootService) {
        this._rootService = rootService;
        this._userService = rootService.userService;
        makeAutoObservable(this);
        this.setHeaders();

        axios.interceptors.response.use(response => {
            return response;
        }, error => {
            switch (error.response?.status ?? 500) {
                case 401: {
                    this.logout();
                    break;
                }
                case 403: {
                    this._rootService.rootStore.message.error("Доступ запрещен", "Для выполнения данной функции не хватает привелегий, либо доступ до запрашиваемых данных ограничен.");
                    break;
                }
                default: {
                    this._rootService.rootStore.message.error("Ошибка на сервере");
                    break;
                }
            }
            return error;
        });
    }

    async login(username: string, password: string): Promise<void> {
        const response = await axios.post<{ access_token: string }>(`${this.restPath}/login`, {username, password});
        window.sessionStorage.setItem(this._squareTokenName, response.data.access_token);
        this.checkAndParseToken();
        this.setHeaders();
    }

    logout(): void {
        window.sessionStorage.setItem(this._squareTokenName, 'null');
        this._userService.user = undefined;
        window.location.reload();
    }

    checkAndParseToken(): void {
        const token = sessionStorage.getItem(this._squareTokenName);
        if (!token || token === 'null') {
            return;
        }
        const base64Url: string = token.split(".")[1];
        const base64: string = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        this._userService.user = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
    }

    setHeaders() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem(this._squareTokenName)}`;
    }
}
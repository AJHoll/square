import RootService from './Root.service';
import {makeAutoObservable} from 'mobx';
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
            if (error.response?.status === 401) {
                this.logout();
            }
            return error;
        });
    }

    async login(username: string, password: string): Promise<void> {
        const response = await axios.post<{ access_token: string }>(`${this._restPath}/login`, {username, password});
        sessionStorage.setItem(this._squareTokenName, response.data.access_token);
        this.checkAndParseToken();
        this.setHeaders();
    }

    logout(): void {
        sessionStorage.setItem(this._squareTokenName, 'null');
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
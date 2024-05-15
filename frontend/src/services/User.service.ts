import {makeAutoObservable} from 'mobx';
import RootService from './Root.service';
import {UserDto} from '../dtos/User.dto';

export default class UserService {
    rootService: RootService;

    get restPath(): string {
        return `${this.rootService.restUrl}/user`;
    }

    private _user: UserDto | undefined;
    get user(): UserDto | undefined {
        return this._user;
    }

    set user(value: UserDto | undefined) {
        this._user = value;
    }

    constructor(rootService: RootService) {
        this.rootService = rootService;
        makeAutoObservable(this);
    }
}
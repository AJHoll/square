import { makeAutoObservable } from 'mobx';
import RootService from './Root.service';
import { UserDto } from '../dtos/User.dto';

export default class UserService {
  rootService: RootService;
  private readonly restPath: string;

  private _user: UserDto | undefined;
  get user(): UserDto | undefined {
    return this._user;
  }

  set user(value: UserDto | undefined) {
    this._user = value;
  }

  constructor(rootService: RootService) {
    this.rootService = rootService;
    this.restPath = `${this.rootService.restUrl}/user`;
    makeAutoObservable(this);
  }
}
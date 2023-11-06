import { makeAutoObservable } from 'mobx';
import { UserDto } from '../dtos/User.dto';
import axios from 'axios';
import RootService from './Root.service';

export default class UserService {
  rootService: RootService;
  private readonly restPath: string;

  constructor(rootService: RootService) {
    this.rootService = rootService;
    this.restPath = `${this.rootService.restUrl}/user`;
    makeAutoObservable(this);
  }

  async auth(username: string, password: string): Promise<UserDto> {
    try {
      const response = await axios.post<UserDto>(`${this.restPath}/${username}/auth`, { username, password });
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
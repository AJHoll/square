import UserService from './User.service';

export default class RootService {
  restUrl: string = 'http://localhost:1024';
  userService: UserService = new UserService(this);
}
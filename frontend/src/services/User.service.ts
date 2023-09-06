import { makeAutoObservable } from 'mobx';

export class UserService {

  get isAuth(): boolean {
    const expiredDateValue = localStorage.getItem('devs.auth.expiredDate');
    if (expiredDateValue) {
      try {
        return +expiredDateValue >= Date.now();
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

const userService = new UserService();
export default userService;
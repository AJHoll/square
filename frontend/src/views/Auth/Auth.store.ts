import { makeAutoObservable } from 'mobx';

export default class AuthStore {
  username: string = '';
  password: string = '';

  constructor() {
    makeAutoObservable(this)
  }

  async login(): Promise<void> {
    console.log(this.username, this.password);
  }
}

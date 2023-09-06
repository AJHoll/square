import AuthStore from './Auth/Auth.store';

export default class RootStore {
  authStore: AuthStore = new AuthStore();
}
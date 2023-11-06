import AuthStore from './Auth/Auth.store';
import RootService from '../services/Root.service';

export default class RootStore {
  rootService: RootService = new RootService();
  authStore: AuthStore = new AuthStore(this);
}
import RootService from './Root.service';
import { makeAutoObservable } from 'mobx';

export default class AdmGroupService {
  private readonly _rootService: RootService;
  private readonly _restPath: string;

  constructor(rootService: RootService) {
    this._rootService = rootService;
    this._restPath = `${rootService.restUrl}/adm-group`;
    makeAutoObservable(this);
  }
}
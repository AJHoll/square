import RootStore from '../../Root.store';
import AdmGroupService from '../../../services/AdmGroup.service';
import { makeAutoObservable } from 'mobx';
import { SelectionChangedEvent } from 'ag-grid-community';
import { AdmGroupRoleDto } from '../../../dtos/AdmGroupRole.dto';
import { AdmRoleDto } from '../../../dtos/AdmRole.dto';

export default class AdmGroupRoleStore {
  private readonly _rootStore: RootStore;
  private readonly _admGroupService: AdmGroupService;

  get addRoleToGroupBtnDisabled(): boolean {
    return false;
  }

  get removeRoleFromGroupBtnDisabled(): boolean {
    return false;
  }

  constructor(rootStore: RootStore,
              admGroupService: AdmGroupService) {
    this._rootStore = rootStore;
    this._admGroupService = admGroupService;
    makeAutoObservable(this);
  }

  groupRoleSelectionChange(event: SelectionChangedEvent<AdmGroupRoleDto>) {

  }

  roleSelectionChange(event: SelectionChangedEvent<AdmRoleDto>) {

  }

  addRoletoGroup() {

  }

  removeRoleFromGroup() {

  }
}
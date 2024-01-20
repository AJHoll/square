import RootStore from '../../Root.store';
import { makeAutoObservable } from 'mobx';
import AdmGroupService from '../../../services/AdmGroup.service';
import { SelectionChangedEvent } from 'ag-grid-community';
import { AdmGroupDto } from '../../../dtos/AdmGroup.dto';

export default class AdmGroupStore {
  private readonly _rootStore: RootStore;
  private readonly _admGroupService: AdmGroupService;

  get editBtnDisabled(): boolean {
    return false;
  }

  get deleteBtnDisabled(): boolean {
    return false;
  }

  constructor(rootStore: RootStore,
              admGroupService: AdmGroupService) {
    this._rootStore = rootStore;
    this._admGroupService = admGroupService;
    makeAutoObservable(this);
  }

  groupSelectionChange(event: SelectionChangedEvent<AdmGroupDto>) {

  }

  createNewGroup() {

  }

  editGroup() {

  }

  deleteGroups() {

  }
}
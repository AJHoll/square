import RootStore from '../../Root.store';
import AdmGroupService from '../../../services/AdmGroup.service';
import { makeAutoObservable } from 'mobx';
import { AdmRoleDto } from '../../../dtos/AdmRole.dto';
import { AdmGroupDto } from '../../../dtos/AdmGroup.dto';

export default class AdmGroupCardStore {
  private readonly _rootStore: RootStore;
  private readonly _admGroupService: AdmGroupService;

  private _visible: boolean = false;
  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  private _title: string = '';
  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  private _loading: boolean = false;
  get loading(): boolean {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
  }

  private _cardItemWasChanged: boolean = false;
  get cardItemWasChanged(): boolean {
    return this._cardItemWasChanged;
  }

  set cardItemWasChanged(value: boolean) {
    this._cardItemWasChanged = value;
  }


  private _admGroup: AdmGroupDto = {};
  get admGroup(): AdmGroupDto {
    return this._admGroup;
  }

  set admGroup(value: AdmGroupDto) {
    this._admGroup = value;
  }

  constructor(rootStore: RootStore,
              admGroupService: AdmGroupService) {
    this._rootStore = rootStore;
    this._admGroupService = admGroupService;
    makeAutoObservable(this);
  }

  setName(name: AdmRoleDto['name']): void {
    this._admGroup.name = name;
    this._cardItemWasChanged = true;
  }

  setCaption(caption: AdmRoleDto['caption']): void {
    this._admGroup.caption = caption;
    this._cardItemWasChanged = true;
  }

  setDescription(description: AdmRoleDto['description']): void {
    this._admGroup.description = description;
    this._cardItemWasChanged = true;
  }

  close(): void {
    this._cardItemWasChanged = false;
    this._admGroup = {};
    this._loading = false;
    this._visible = false;
  }

  async save(): Promise<void> {
    if (this._admGroup.id) {
      await this._admGroupService.editGroup(this._admGroup.id, this._admGroup);
    } else {
      await this._admGroupService.createGroup(this._admGroup);
    }
    this.close();
    await this._rootStore.admGroupStore.reloadGroups();
  }
}
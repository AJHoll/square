import RootStore from '../../Root.store';
import AdmRoleService from '../../../services/AdmRole.service';
import { makeAutoObservable } from 'mobx';
import { AdmRoleDto } from '../../../dtos/AdmRole.dto';

export default class AdmRoleCardStore {
  private readonly _rootStore: RootStore;
  private readonly _admRoleService: AdmRoleService;

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


  private _admRole: AdmRoleDto = {};
  get admRole(): AdmRoleDto {
    return this._admRole;
  }

  set admRole(value: AdmRoleDto) {
    this._admRole = value;
  }

  constructor(rootStore: RootStore, admRoleService: AdmRoleService) {
    this._rootStore = rootStore;
    this._admRoleService = admRoleService;
    makeAutoObservable(this);
  }

  setName(name: AdmRoleDto['name']): void {
    this._admRole.name = name;
    this._cardItemWasChanged = true;
  }

  setCaption(caption: AdmRoleDto['caption']): void {
    this._admRole.caption = caption;
    this._cardItemWasChanged = true;
  }

  setDescription(description: AdmRoleDto['description']): void {
    this._admRole.description = description;
    this._cardItemWasChanged = true;
  }

  close(): void {
    this._cardItemWasChanged = false;
    this._admRole = {};
    this._loading = false;
    this._visible = false;
  }

  async save(): Promise<void> {
    if (this._admRole.id) {
      await this._admRoleService.editRole(this._admRole.id, this._admRole);
    } else {
      await this._admRoleService.createRole(this._admRole);
    }
    this.close();
    await this._rootStore.admRoleStore.reloadRoles();
  }
}
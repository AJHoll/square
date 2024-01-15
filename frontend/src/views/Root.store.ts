import AuthStore from './Auth/Auth.store';
import RootService from '../services/Root.service';
import MainMenuStore from './MainMenu/MainMenu.store';
import AdmRoleStore from './AdmRole/AdmRole.store';
import DevsToast from '@ajholl/devsuikit/dist/DevsToast';
import React from 'react';
import AdmRoleCardStore from './AdmRole/components/AdmRoleCard.store';
import AdmRoleMenuStore from './AdmRole/components/AdmRoleMenu.store';

export default class RootStore {
  readonly projectName = '[Скверъ]';
  rootService: RootService = new RootService();
  authStore: AuthStore = new AuthStore(this);
  mainMenuStore: MainMenuStore = new MainMenuStore(this, this.rootService.mainMenuService);

  admRoleMenuStore: AdmRoleMenuStore = new AdmRoleMenuStore(this, this.rootService.admRoleService);
  admRoleCardStore: AdmRoleCardStore = new AdmRoleCardStore(this, this.rootService.admRoleService);
  admRoleStore: AdmRoleStore = new AdmRoleStore(this, this.rootService.admRoleService);


  toastRef: React.RefObject<DevsToast> | null = null;

  get message(): DevsToast {
    return this.toastRef!.current!;
  }
}
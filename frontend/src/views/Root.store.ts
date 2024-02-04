import AuthStore from './Auth/Auth.store';
import RootService from '../services/Root.service';
import MainMenuStore from './MainMenu/MainMenu.store';
import AdmRoleStore from './AdmRole/components/AdmRole.store';
import DevsToast from '@ajholl/devsuikit/dist/DevsToast';
import React from 'react';
import AdmRoleCardStore from './AdmRole/components/AdmRoleCard.store';
import AdmRoleMenuStore from './AdmRole/components/AdmRoleMenu.store';
import AdmGroupStore from './AdmGroup/components/AdmGroup.store';
import AdmGroupRoleStore from './AdmGroup/components/AdmGroupRole.store';
import AdmGroupCardStore from './AdmGroup/components/AdmGroupCard.store';
import AdmUserStore from "./AdmUser/components/AdmUser.store";
import AdmUserGroupStore from "./AdmUser/components/AdmUserGroup.store";
import AdmUserCardStore from "./AdmUser/components/AdmUserCard.store";

export default class RootStore {
    readonly projectName = '[Скверъ]';
    readonly rootService: RootService = new RootService();
    readonly authStore: AuthStore = new AuthStore(this);
    readonly mainMenuStore: MainMenuStore = new MainMenuStore(this, this.rootService.mainMenuService);

    readonly admRoleMenuStore: AdmRoleMenuStore = new AdmRoleMenuStore(this, this.rootService.admRoleService, this.rootService.krnMenuService);
    readonly admRoleCardStore: AdmRoleCardStore = new AdmRoleCardStore(this, this.rootService.admRoleService);
    readonly admRoleStore: AdmRoleStore = new AdmRoleStore(this, this.rootService.admRoleService);

    readonly admGroupRoleStore: AdmGroupRoleStore = new AdmGroupRoleStore(this, this.rootService.admGroupService, this.rootService.admRoleService);
    readonly admGroupCardStore: AdmGroupCardStore = new AdmGroupCardStore(this, this.rootService.admGroupService);
    readonly admGroupStore: AdmGroupStore = new AdmGroupStore(this, this.rootService.admGroupService);

    readonly admUserGroupStore: AdmUserGroupStore = new AdmUserGroupStore(this, this.rootService.admUserService, this.rootService.admGroupService);
    readonly admUserCardStore: AdmUserCardStore = new AdmUserCardStore(this, this.rootService.admUserService);
    readonly admUserStore: AdmUserStore = new AdmUserStore(this, this.rootService.admUserService);

    toastRef: React.RefObject<DevsToast> | null = null;

    get message(): DevsToast {
        return this.toastRef!.current!;
    }
}
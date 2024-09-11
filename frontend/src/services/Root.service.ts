import UserService from './User.service';
import AuthService from './Auth.service';
import MainMenuService from './MainMenu.service';
import AdmRoleService from './AdmRole.service';
import KrnMenuService from './KrnMenu.service';
import AdmGroupService from './AdmGroup.service';
import AdmUserService from "./AdmUser.service";
import SqrRoleService from "./SqrRole.service";
import SqrSquareService from "./SqrSquare.service";
import {SqrManageCriteriaService} from "./SqrManageCriteria.service";
import {makeAutoObservable} from "mobx";
import SqrManageRateService from "./SqrManageRate.service";
import RootStore from "../views/Root.store";
import QuestionAnswerService from "./QuestionAnswer.service";

export default class RootService {
    private _restUrl: string | undefined;
    get restUrl(): string | undefined {
        return this._restUrl;
    }

    set restUrl(value: string | undefined) {
        this._restUrl = value;
    }

    rootStore: RootStore;

    userService: UserService = new UserService(this);
    authService: AuthService = new AuthService(this);
    mainMenuService: MainMenuService = new MainMenuService(this);
    admRoleService: AdmRoleService = new AdmRoleService(this);
    admGroupService: AdmGroupService = new AdmGroupService(this);
    admUserService: AdmUserService = new AdmUserService(this);
    krnMenuService: KrnMenuService = new KrnMenuService(this);
    sqrRoleService: SqrRoleService = new SqrRoleService(this);
    sqrSquareService: SqrSquareService = new SqrSquareService(this);
    sqrManageCriteriaService: SqrManageCriteriaService = new SqrManageCriteriaService(this);
    sqrManageRateService: SqrManageRateService = new SqrManageRateService(this);
    questionAnswerService: QuestionAnswerService = new QuestionAnswerService(this);

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
}
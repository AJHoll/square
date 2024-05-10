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

export default class RootService {
    restUrl: string = 'http://localhost:1024'; // TODO: Переделать потом на config.json в assets
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
}
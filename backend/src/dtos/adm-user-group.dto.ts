import {AdmUserDto} from "./adm-user.dto";
import {AdmGroupDto} from "./adm-group.dto";

export interface AdmUserGroupDto {
    id?: number;
    user?: AdmUserDto;
    group?: AdmGroupDto;
}
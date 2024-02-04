import {AdmUserDto} from "./AdmUser.dto";
import {AdmGroupDto} from "./AdmGroup.dto";

export interface AdmUserGroupDto {
    id?: number;
    user?: AdmUserDto;
    group?: AdmGroupDto;
}
import {SqrSquareUserDto} from "./SqrSquareUser.dto";
import {SqrTeamDto} from "./SqrTeam.dto";
import {SqrRoleDto} from "./SqrRole.dto";

export interface SqrSquareTeamUserDto {
    id?: number;
    team?: SqrTeamDto,
    user?: SqrSquareUserDto,
    role?: SqrRoleDto,
}
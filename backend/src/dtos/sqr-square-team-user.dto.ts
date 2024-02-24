import {SqrSquareUserDto} from "./sqr-square-user.dto";
import {SqrTeamDto} from "./sqr-team.dto";
import {SqrRoleDto} from "./sqr-role.dto";

export interface SqrSquareTeamUserDto {
    id?: number;
    team?: SqrTeamDto,
    role?: SqrRoleDto,
    user?: SqrSquareUserDto
}
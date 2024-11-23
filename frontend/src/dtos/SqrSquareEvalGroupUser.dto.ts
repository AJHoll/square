import {SqrSquareUserDto} from "./SqrSquareUser.dto";
import {SqrRoleDto} from "./SqrRole.dto";

export interface SqrSquareEvalGroupUserDto extends SqrSquareUserDto {
    role?: SqrRoleDto;
    shortName?: string;
    color?: string;
}
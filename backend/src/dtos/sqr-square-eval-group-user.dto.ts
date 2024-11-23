import {SqrSquareUserDto} from "./sqr-square-user.dto";
import {SqrRoleDto} from "./sqr-role.dto";

export interface SqrSquareEvalGroupUserDto extends SqrSquareUserDto {
  role?: SqrRoleDto;
  shortName?: string;
  color?: string;
}
import { RoleDto } from './Role.dto';

export interface UserDto {
  login: string;
  expiredDate: Date;
  roles: RoleDto[];
}
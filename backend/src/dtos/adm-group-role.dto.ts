import { AdmRoleDto } from './adm-role.dto';
import { AdmGroupDto } from './adm-group.dto';

export interface AdmGroupRoleDto {
  id?: number;
  group?: AdmGroupDto;
  role?: AdmRoleDto;
}
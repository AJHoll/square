import { AdmGroupDto } from './AdmGroup.dto';
import { AdmRoleDto } from './AdmRole.dto';

export interface AdmGroupRoleDto {
  id?: number;
  group: AdmGroupDto;
  role: AdmRoleDto;
}
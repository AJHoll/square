import { AdmRoleDto } from './adm-role.dto';
import { KrnMenuItemDto } from './krn-menu-item.dto';

export interface AdmRoleMenuDto {
  id?: number,
  role: AdmRoleDto;
  menuItem: KrnMenuItemDto;
}
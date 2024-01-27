import { AdmRoleDto } from './AdmRole.dto';
import { KrnMenuItemDto } from './KrnMenuItem.dto';

export interface AdmRoleMenuDto {
  id?: number,
  role?: AdmRoleDto;
  menuItem?: KrnMenuItemDto;
}
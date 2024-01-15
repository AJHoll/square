import { KrnMenuGroupDto } from './krn-menu-group.dto';

export interface KrnMenuItemDto {
  id?: number;
  group: KrnMenuGroupDto;
  title: string;
  url: string;
  icon: string;
}
import { KrnMenuGroupDto } from './KrnMenuGroup.dto';

export interface KrnMenuItemDto {
  id?: number;
  group: KrnMenuGroupDto;
  title: string;
  url: string;
  icon: string;
}
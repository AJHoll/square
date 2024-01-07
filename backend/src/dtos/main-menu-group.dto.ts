import { MainMenuItemDto } from './main-menu-item.dto';

export interface MainMenuGroupDto {
  id: number;
  title: string;
  order: number;
  icon?: string;
  items: MainMenuItemDto[];
}
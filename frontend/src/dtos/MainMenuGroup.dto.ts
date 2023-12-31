import { MainMenuItemDto } from './MainMenuItem.dto';

export interface MainMenuGroupDto {
  id: number;
  title: string;
  order: number;
  icon?: string;
  items: MainMenuItemDto[];
}
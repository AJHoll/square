import { Module } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { MainMenuController } from './main-menu.controller';
import { MainMenuService } from './main-menu.service';

@Module({
  providers: [MainMenuService, DatabaseService],
  controllers: [MainMenuController],
  exports: [MainMenuService],
})
export class MainMenuModule {
}
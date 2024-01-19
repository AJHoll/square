import { Module } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { KrnMenuController } from './krn-menu.controller';
import { KrnMenuService } from './krn-menu.service';

@Module({
  controllers: [KrnMenuController],
  providers: [KrnMenuService, DatabaseService],
  exports: [KrnMenuService],
})
export class KrnMenuModule {
}

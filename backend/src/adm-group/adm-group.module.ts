import { Module } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { AdmGroupController } from './adm-group.controller';
import { AdmGroupService } from './adm-group.service';

@Module({
  controllers: [AdmGroupController],
  providers: [AdmGroupService, DatabaseService],
  exports: [AdmGroupService],
})
export class AdmGroupModule {
}

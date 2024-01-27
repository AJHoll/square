import { Module } from '@nestjs/common';
import { AdmRoleController } from './adm-role.controller';
import { AdmRoleService } from './adm-role.service';
import { DatabaseService } from '../services/database.service';

@Module({
  controllers: [AdmRoleController],
  providers: [AdmRoleService, DatabaseService],
  exports: [AdmRoleService],
})
export class AdmRoleModule {
}

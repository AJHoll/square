import { Module } from '@nestjs/common';
import { AdmRoleController } from './admRoleController';
import { AdmRoleService } from './adm-role.service';
import { DatabaseService } from '../services/database.service';

@Module({
  controllers: [AdmRoleController],
  providers: [AdmRoleService, DatabaseService],
  exports: [AdmRoleService],
})
export class AdmRoleModule {
}

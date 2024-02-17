import {Module} from '@nestjs/common';
import {SqrRoleController} from './sqr-role.controller';
import {SqrRoleService} from './sqr-role.service';
import {DatabaseService} from '../services/database.service';
import {AdmGroupService} from "../adm-group/adm-group.service";

@Module({
    controllers: [SqrRoleController],
    providers: [SqrRoleService, AdmGroupService, DatabaseService],
    exports: [SqrRoleService],
})
export class SqrRoleModule {
}

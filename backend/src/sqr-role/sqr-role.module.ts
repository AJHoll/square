import {Module} from '@nestjs/common';
import {SqrRoleController} from './sqr-role.controller';
import {SqrRoleService} from './sqr-role.service';
import {DatabaseService} from '../services/database.service';

@Module({
    controllers: [SqrRoleController],
    providers: [SqrRoleService, DatabaseService],
    exports: [SqrRoleService],
})
export class SqrRoleModule {
}

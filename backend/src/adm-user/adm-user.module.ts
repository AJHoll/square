import {Module} from '@nestjs/common';
import {DatabaseService} from "../services/database.service";
import {AdmUserController} from "./adm-user.controller";
import {AdmUserService} from "./adm-user.service";

@Module({
    controllers: [AdmUserController],
    providers: [AdmUserService, DatabaseService],
    exports: [AdmUserService],
})
export class AdmUserModule {
}

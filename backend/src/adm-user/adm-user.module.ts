import {Module} from '@nestjs/common';
import {DatabaseService} from "../services/database.service";
import {AdmUserController} from "./adm-user.controller";
import {AdmUserService} from "./adm-user.service";
import {SqrSquareService} from "../sqr-square/sqr-square.service";

@Module({
    controllers: [AdmUserController],
    providers: [SqrSquareService, AdmUserService, DatabaseService],
    exports: [AdmUserService],
})
export class AdmUserModule {
}

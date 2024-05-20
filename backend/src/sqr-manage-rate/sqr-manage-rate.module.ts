import {Module} from "@nestjs/common";
import {DatabaseService} from "../services/database.service";
import {SqrManageRateService} from "./sqr-manage-rate.service";
import {SqrManageRateController} from "./sqr-manage-rate.controller";
import {SqrSquareService} from "../sqr-square/sqr-square.service";

@Module({
    providers: [SqrManageRateService, DatabaseService,SqrSquareService],
    controllers: [SqrManageRateController],
    exports: [SqrManageRateService],
})
export class SqrManageRateModule {
}
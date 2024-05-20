import {Module} from "@nestjs/common";
import {DatabaseService} from "../services/database.service";
import {SqrManageCriteriaService} from "./sqr-manage-criteria.service";
import {SqrManageCriteriaController} from "./sqr-manage-criteria.controller";
import {SqrSquareService} from "../sqr-square/sqr-square.service";

@Module({
    providers: [SqrManageCriteriaService, DatabaseService, SqrSquareService],
    controllers: [SqrManageCriteriaController],
    exports: [SqrManageCriteriaService],
})
export class SqrManageCriteriaModule {
}
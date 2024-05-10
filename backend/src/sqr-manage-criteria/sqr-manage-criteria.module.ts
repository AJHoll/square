import {Module} from "@nestjs/common";
import {DatabaseService} from "../services/database.service";
import {SqrManageCriteriaService} from "./sqr-manage-criteria.service";
import {SqrManageCriteriaController} from "./sqr-manage-criteria.controller";

@Module({
    providers: [SqrManageCriteriaService, DatabaseService],
    controllers: [SqrManageCriteriaController],
    exports: [SqrManageCriteriaService],
})
export class SqrManageCriteriaModule {
}
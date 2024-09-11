import {Module} from "@nestjs/common";
import {DatabaseService} from "../services/database.service";
import {QuestionAnswerService} from "./question-answer.service";
import {QuestionAnswerController} from "./question-answer.controller";

@Module({
    providers: [QuestionAnswerService, DatabaseService],
    controllers: [QuestionAnswerController],
    exports: [QuestionAnswerService],
})
export class QuestionAnswerModule {
}
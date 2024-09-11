import {Controller, Get, ParseIntPipe, Query, Request, UseGuards} from "@nestjs/common";
import {QuestionAnswerService} from "./question-answer.service";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {UserDto} from "../dtos/user.dto";
import {SqrSquareDto} from "../dtos/sqr-square.dto";
import {QuestionDto} from "../dtos/question.dto";

@Controller('question-answer')
export class QuestionAnswerController {
    constructor(private readonly questionAnswerService: QuestionAnswerService) {
    }


    @UseGuards(JwtAuthGuard)
    @Get()
    async getQuestions(@Request() {user}: { user: UserDto },
                       @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id']): Promise<QuestionDto[]> {
        return this.questionAnswerService.getQuestions(squareId);
    }
}
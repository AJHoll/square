import {Injectable} from "@nestjs/common";
import {QuestionDto} from "../dtos/question.dto";
import {DatabaseService} from "../services/database.service";
import {SqrSquareDto} from "../dtos/sqr-square.dto";

@Injectable()
export class QuestionAnswerService {

    constructor(private databaseService: DatabaseService) {
    }

    async getQuestions(squareId: SqrSquareDto['id']): Promise<QuestionDto[]> {
        // @ts-ignor2e2
        const records = await this.databaseService.sqr_question.findMany({
            where: {square_id: squareId},
            include: {
                sqr_square: true,
                sqr_square_team: true,
                adm_user: true,
                sqr_question_answer: {include: {adm_user: true, sqr_role: true}}
            }
        });
        return records.map((rec) => ({
            id: rec.id.toNumber(),
            square: {
                id: rec.sqr_square.id.toNumber(),
                name: rec.sqr_square.name,
                caption: rec.sqr_square.caption,
                description: rec.sqr_square.description
            },
            team: {
                id: rec.sqr_square_team.id.toNumber(),
                name: rec.sqr_square_team.name,
                caption: rec.sqr_square_team.caption,
                description: rec.sqr_square_team.description,
            },
            user: {
                id: rec.adm_user.id.toNumber(),
                name: rec.adm_user.name,
                caption: rec.adm_user.caption
            },
            question: rec.question,
            questionTime: rec.question_time,
            answers: rec.sqr_question_answer.map((aRec) => ({
                id: aRec.id.toNumber(),
                question_id: aRec.question_id.toNumber(),
                user: {
                    id: aRec.adm_user.id.toNumber(),
                    name: aRec.adm_user.name,
                    caption: aRec.adm_user.caption,
                },
                role: {
                    id: aRec.sqr_role.id.toNumber(),
                    name: aRec.sqr_role.name,
                    caption: aRec.sqr_role.caption,
                    description: aRec.sqr_role.description,
                },
                answer: aRec.answer,
                answerTime: aRec.answer_time
            }))
        }));
    }
}
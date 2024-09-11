import {SqrSquareDto} from "./sqr-square.dto";
import {SqrTeamDto} from "./sqr-team.dto";
import {AdmUserDto} from "./adm-user.dto";
import {QuestionAnswerDto} from "./question-answer.dto";

export interface QuestionDto {
    id: number;
    square: SqrSquareDto;
    team: SqrTeamDto;
    user: AdmUserDto;
    question: string;
    questionTime: Date;
    answers: QuestionAnswerDto[];
}
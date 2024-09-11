import {SqrSquareDto} from "./SqrSquare.dto";
import {SqrTeamDto} from "./SqrTeam.dto";
import {AdmUserDto} from "./AdmUser.dto";
import {QuestionAnswerDto} from "./QuestionAnswer.dto";

export interface QuestionDto {
    id: number;
    square: SqrSquareDto;
    team: SqrTeamDto;
    user: AdmUserDto;
    question: string;
    questionTime: Date;
    answers: QuestionAnswerDto[];
}
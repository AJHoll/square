import {QuestionDto} from "./question.dto";
import {AdmUserDto} from "./adm-user.dto";
import {SqrRoleDto} from "./sqr-role.dto";

export interface QuestionAnswerDto {
    id: number;
    question_id: QuestionDto['id'];
    user: AdmUserDto;
    role: SqrRoleDto;
    answer: string;
    answerTime: Date;
}
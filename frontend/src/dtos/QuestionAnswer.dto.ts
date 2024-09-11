import {QuestionDto} from "./Question.dto";
import {AdmUserDto} from "./AdmUser.dto";
import {SqrRoleDto} from "./SqrRole.dto";

export interface QuestionAnswerDto {
    id: number;
    question_id: QuestionDto['id'];
    user: AdmUserDto;
    role: SqrRoleDto;
    answer: string;
    answerTime: Date;
}
import './Answer.scss';
import React from "react";
import {QuestionAnswerDto} from "../../../dtos/QuestionAnswer.dto";
import DevsPanel from "@ajholl/devsuikit/dist/DevsPanel";

interface AnswerProps {
    answer: QuestionAnswerDto;
}

export class Answer extends React.Component<AnswerProps> {
    render() {
        const {answer} = this.props;
        return <DevsPanel className="question_answer">
            <div className="question_answer_title">
                <div className="question_answer_title__time">{new Date(answer.answerTime).toLocaleString()}</div>
                <div className="question_answer_title__user">{answer.user.caption}</div>
                <div className="question_answer_title__role">{answer.role.caption}</div>
            </div>
            <div className="question_answer_content">
                {answer.answer}
            </div>
        </DevsPanel>
    }
}
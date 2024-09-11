import './Question.scss';
import React from "react";
import {QuestionDto} from "../../../dtos/Question.dto";
import {Answer} from "./Answer";
import DevsPanel from "@ajholl/devsuikit/dist/DevsPanel";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import DevsTextArea from "@ajholl/devsuikit/dist/DevsTextArea";
import {StoreProps} from "../../../interfaces/StoreProps";

export interface QuestionProps extends StoreProps {
    question: QuestionDto;
}

interface QuestionState {
    mode: 'view' | 'edit';
}

export class Question extends React.Component<QuestionProps, QuestionState> {

    componentDidMount() {
        this.setState({mode: 'view'});
    }

    render() {
        const {question} = this.props;
        const {mode} = this.state ?? {};
        return <DevsPanel className="question">
            <div className="question_title">
                <div className="question_title__time">{new Date(question.questionTime).toLocaleString()}</div>
                <div className="question_title__user">{question.user.caption}</div>
                <div className="question_title__team">{question.team.caption}</div>
            </div>
            <div className="question_content">
                {question.question}
            </div>
            <div className="question_answers">
                <div className="question_answers__input_form">
                    {
                        (mode ?? 'view') === 'view' ?
                            <DevsButton template="outlined"
                                        color="primary"
                                        icon="lni lni-plus"
                                        title="Добавить ответ"
                                        onClick={() => this.setState({mode: 'edit'})}
                            />
                            : <label>
                                Ответ
                                <DevsTextArea/>
                                <div className="input_form_footer">
                                    <DevsButton template="filled"
                                                color="success"
                                                title="Ответить"
                                                onClick={() => {
                                                    // this.questionAnswerStore.addAnswer(question.id)
                                                    this.setState({mode: 'view'});
                                                }}
                                    />
                                    <DevsButton template="filled"
                                                color="danger"
                                                title="Отменить"
                                                onClick={() => (this.setState({mode: 'view'}))}
                                    />
                                </div>
                            </label>
                    }

                </div>
                <div className="question_answers__title">Ответы:</div>
                <div className="question_answers__content">
                    {question.answers.map((answer) => <Answer key={answer.id} answer={answer}/>)}
                </div>
            </div>
        </DevsPanel>
    }
}
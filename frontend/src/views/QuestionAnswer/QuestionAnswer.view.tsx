import './QuestionAnswer.view.scss';
import React from "react";
import {BaseViewProps} from "../../interfaces/BaseViewProps";
import {observer} from "mobx-react";
import DevsSelect from "@ajholl/devsuikit/dist/DevsSelect";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import QuestionAnswerStore from "./QuestionAnswer.store";
import {Question} from "./components/Question";
import DevsTextArea from "@ajholl/devsuikit/dist/DevsTextArea";
import DevsPanel from "@ajholl/devsuikit/dist/DevsPanel";

interface QuestionAnswerViewProps extends BaseViewProps {
}

export class QuestionAnswerView extends React.Component<QuestionAnswerViewProps> {
    readonly questionAnswerStore: QuestionAnswerStore = this.props.rootStore.questionAnswerStore;
    selectRef: React.RefObject<DevsSelect> = React.createRef();

    async componentDidMount(): Promise<void> {
        document.title = this.props.title;
        await this.questionAnswerStore.init(this.selectRef);
    }

    render() {
        return <div className="question_answer_view">
            <div className="question_answer_view__toolbar">
                <DevsButton template="outlined"
                            color="primary"
                            icon="lni lni-reload"
                            onClick={() => this.questionAnswerStore.reloadQuestions()}
                />
                <DevsSelect ref={this.selectRef}
                            addonBefore={<span style={{paddingLeft: '10px', paddingRight: '10px'}}>Площадка</span>}
                            options={this.questionAnswerStore.squares}
                            value={this.questionAnswerStore.selectedSquare}
                            onlySelection={true}
                />
            </div>
            <div className="question_answer_view__content">
                {this.questionAnswerStore.questions.map((question) => (
                    <Question key={question.id} question={question} rootStore={this.props.rootStore}/>))}
            </div>
            <DevsPanel className={`question_answer_view__input_form mode_${this.questionAnswerStore.mode}`}>
                {
                    this.questionAnswerStore.mode === 'view' ?
                        <DevsButton template="filled"
                                    color="primary"
                                    title="Задать вопрос"
                                    onClick={() => (this.questionAnswerStore.mode = 'edit')}
                        />
                        : <label>
                            Вопрос
                            <DevsTextArea value={this.questionAnswerStore.addQuestionText}
                                          onChange={(event) => this.questionAnswerStore.addQuestionText = event.target.value}
                            />
                            <div className="input_form_footer">
                                <DevsButton template="filled"
                                            color="success"
                                            title="Задать"
                                            onClick={() => this.questionAnswerStore.addQuestion()}
                                />
                                <DevsButton template="filled"
                                            color="danger"
                                            title="Отменить"
                                            onClick={() => (this.questionAnswerStore.mode = 'view')}
                                />
                            </div>
                        </label>
                }

            </DevsPanel>
        </div>;
    }
}

const OQuestionAnswerView = observer(QuestionAnswerView);
export default OQuestionAnswerView;
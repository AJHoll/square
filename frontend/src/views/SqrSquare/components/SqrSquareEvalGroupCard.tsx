import './SqrSquareEvalGroupCard.scss';
import React from "react";
import {StoreProps} from "../../../interfaces/StoreProps";
import {observer} from "mobx-react";
import {SqrSquareEvalGroupCardStore} from "./SqrSquareEvalGroupCard.store";
import DevsCard from "../../../components/DevsCard/DevsCard";
import DevsForm from "@ajholl/devsuikit/dist/DevsForm";
import DevsFormItem from "@ajholl/devsuikit/dist/DevsFormItem";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import DevsSelect from "@ajholl/devsuikit/dist/DevsSelect";
import {v4 as uuid} from "uuid";

interface SqrSquareEvalGroupCardProps extends StoreProps {
}

export class SqrSquareEvalGroupCard extends React.Component<SqrSquareEvalGroupCardProps> {
    readonly sqrSquareEvalGroupCardStore: SqrSquareEvalGroupCardStore = this.props.rootStore.sqrSquareEvalGroupCardStore;

    render() {
        return <DevsCard title={this.sqrSquareEvalGroupCardStore.title}
                         visible={this.sqrSquareEvalGroupCardStore.visible}
                         loading={this.sqrSquareEvalGroupCardStore.loading}
                         cardItemWasChanged={this.sqrSquareEvalGroupCardStore.cardItemWasChanged}
                         onCloseBtnClicked={() => this.sqrSquareEvalGroupCardStore.close()}
                         onCancelBtnClicked={() => this.sqrSquareEvalGroupCardStore.close()}
                         modalStyle={{width: '500px', height: 'fit-content'}}
                         onSaveBtnClicked={async () => await this.sqrSquareEvalGroupCardStore.save()}
        >
            <DevsForm labelflex={2} inputflex={5}>
                <DevsFormItem label="Код">
                    <DevsInput keyFilter="alphanum"
                               value={this.sqrSquareEvalGroupCardStore.sqrEvalGroup.code}
                               onChange={(event) => this.sqrSquareEvalGroupCardStore.setCode(event.target.value)}
                    />
                </DevsFormItem>
                <DevsFormItem label="Наименование">
                    <DevsInput value={this.sqrSquareEvalGroupCardStore.sqrEvalGroup.caption}
                               onChange={(event) => this.sqrSquareEvalGroupCardStore.setCaption(event.target.value)}
                    />
                </DevsFormItem>
                <DevsFormItem label="Модули">
                    <div className="modules_input">
                        <div className="modules_input__button">
                            <DevsButton template='filled'
                                        color="success"
                                        icon="lni lni-plus"
                                        onClick={() => this.sqrSquareEvalGroupCardStore.addNewModulesBtnClick()}
                            ></DevsButton>
                        </div>
                        <div className="modules_input__input">
                            {
                                (this.sqrSquareEvalGroupCardStore.sqrEvalGroup.formModules ?? [])
                                    .map(module => (
                                        <div className="modules_input__input-row" key={module.value ?? uuid()}
                                        >
                                            <DevsSelect options={this.sqrSquareEvalGroupCardStore.squareModules}
                                                        value={module}
                                                        onlySelection={true}
                                                        onChange={(event) => this.sqrSquareEvalGroupCardStore.setFormModule(module, {...event.value})}
                                            />
                                            <DevsButton template='filled'
                                                        color="danger"
                                                        icon="lni lni-minus"
                                                        onClick={() => this.sqrSquareEvalGroupCardStore.removeFormModule(module)}
                                            ></DevsButton>
                                        </div>
                                    ))
                            }
                        </div>
                    </div>

                </DevsFormItem>
            </DevsForm>
        </DevsCard>;
    }
}

const OSqrSquareEvalGroupCard = observer(SqrSquareEvalGroupCard);
export default OSqrSquareEvalGroupCard;
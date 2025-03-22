import {StoreProps} from "../../../interfaces/StoreProps";
import React from "react";
import {observer} from "mobx-react";
import "./SqrSquareModule.scss";
import {SqrSquareModuleCardStore} from "./SqrSquareModuleCard.store";
import DevsCard from "../../../components/DevsCard/DevsCard";
import DevsForm from "@ajholl/devsuikit/dist/DevsForm";
import DevsFormItem from "@ajholl/devsuikit/dist/DevsFormItem";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";
import DevsCheckbox from "@ajholl/devsuikit/dist/DevsCheckbox";

interface SqrSquareModuleCardProps extends StoreProps {
}

export class SqrSquareModuleCard extends React.Component<SqrSquareModuleCardProps> {
    readonly sqrSquareModuleCardStore: SqrSquareModuleCardStore = this.props.rootStore.sqrSquareModuleCardStore;

    render() {
        return <DevsCard title={this.sqrSquareModuleCardStore.title}
                         visible={this.sqrSquareModuleCardStore.visible}
                         loading={this.sqrSquareModuleCardStore.loading}
                         cardItemWasChanged={this.sqrSquareModuleCardStore.cardItemWasChanged}
                         onCloseBtnClicked={() => this.sqrSquareModuleCardStore.close()}
                         onCancelBtnClicked={() => this.sqrSquareModuleCardStore.close()}
                         modalStyle={{width: '500px', height: '300px'}}
                         onSaveBtnClicked={async () => await this.sqrSquareModuleCardStore.save()}
        >
            <DevsForm labelflex={3} inputflex={5}>
                <DevsFormItem label="Код">
                    <DevsInput keyFilter="alphanum"
                               value={this.sqrSquareModuleCardStore.sqrSquareModule.code}
                               onChange={(event) => this.sqrSquareModuleCardStore.setCode(event.target.value)}
                    />
                </DevsFormItem>
                <DevsFormItem label="Наименование">
                    <DevsInput value={this.sqrSquareModuleCardStore.sqrSquareModule.caption}
                               onChange={(event) => this.sqrSquareModuleCardStore.setCaption(event.target.value)}
                    />
                </DevsFormItem>
                <DevsFormItem label="Доступен для проверки">
                    <DevsCheckbox value={this.sqrSquareModuleCardStore.sqrSquareModule.evaluating}
                                  onChange={(event) => this.sqrSquareModuleCardStore.setEvaluating(event.checked)}
                    />
                </DevsFormItem>
            </DevsForm>
        </DevsCard>;
    }
}

const OSqrSquareModuleCard = observer(SqrSquareModuleCard);
export default OSqrSquareModuleCard;

import './SqrSquareEvalGroupCard.scss';
import React from "react";
import {StoreProps} from "../../../interfaces/StoreProps";
import {observer} from "mobx-react";
import {SqrSquareEvalGroupCardStore} from "./SqrSquareEvalGroupCard.store";
import DevsCard from "../../../components/DevsCard/DevsCard";
import DevsForm from "@ajholl/devsuikit/dist/DevsForm";
import DevsFormItem from "@ajholl/devsuikit/dist/DevsFormItem";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";

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
                         modalStyle={{width: '500px', height: '300px'}}
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
                    <DevsInput value={this.sqrSquareEvalGroupCardStore.sqrEvalGroup.modules}
                               onChange={(event) => this.sqrSquareEvalGroupCardStore.setModules(event.target.value)}
                    />
                </DevsFormItem>
            </DevsForm>
        </DevsCard>;
    }
}

const OSqrSquareEvalGroupCard = observer(SqrSquareEvalGroupCard);
export default OSqrSquareEvalGroupCard;
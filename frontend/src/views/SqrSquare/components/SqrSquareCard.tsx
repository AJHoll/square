import {observer} from "mobx-react";
import {StoreProps} from "../../../interfaces/StoreProps";
import React from "react";
import './SqrSquareCard.scss';
import DevsCard from "../../../components/DevsCard/DevsCard";
import DevsForm from "@ajholl/devsuikit/dist/DevsForm";
import DevsFormItem from "@ajholl/devsuikit/dist/DevsFormItem";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";
import DevsTextArea from "@ajholl/devsuikit/dist/DevsTextArea";
import SqrSquareCardStore from "./SqrSquareCard.store";

interface SqrSquareCardProps extends StoreProps {
}

export class SqrSquareCard extends React.Component<SqrSquareCardProps> {
    sqrSquareCardStore: SqrSquareCardStore = this.props.rootStore.sqrSquareCardStore;

    render() {
        return <DevsCard title={this.sqrSquareCardStore.title}
                         visible={this.sqrSquareCardStore.visible}
                         loading={this.sqrSquareCardStore.loading}
                         cardItemWasChanged={this.sqrSquareCardStore.cardItemWasChanged}
                         onCloseBtnClicked={() => this.sqrSquareCardStore.close()}
                         onCancelBtnClicked={() => this.sqrSquareCardStore.close()}
                         modalStyle={{width: '500px', height: '300px'}}
                         onSaveBtnClicked={async () => await this.sqrSquareCardStore.save()}
        >
            <DevsForm labelflex={2} inputflex={5}>
                <DevsFormItem label="Системное имя">
                    <DevsInput keyFilter="alphanum"
                               value={this.sqrSquareCardStore.sqrSquare.name}
                               onChange={(event) => this.sqrSquareCardStore.setName(event.target.value)}
                    />
                </DevsFormItem>
                <DevsFormItem label="Наименование">
                    <DevsInput value={this.sqrSquareCardStore.sqrSquare.caption}
                               onChange={(event) => this.sqrSquareCardStore.setCaption(event.target.value)}
                    />
                </DevsFormItem>
                <DevsFormItem label="Описание">
                    <DevsTextArea value={this.sqrSquareCardStore.sqrSquare.description}
                                  onChange={(event) => this.sqrSquareCardStore.setDescription(event.target.value)}
                    />
                </DevsFormItem>
            </DevsForm>
        </DevsCard>;
    }
}

const OSqrSquareCard = observer(SqrSquareCard);
export default OSqrSquareCard;
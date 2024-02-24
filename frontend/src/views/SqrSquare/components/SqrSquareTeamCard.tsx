import './SqrSquareTeamCard.scss';
import {StoreProps} from "../../../interfaces/StoreProps";
import React from "react";
import {observer} from "mobx-react";
import SqrSquareTeamCardStore from "./SqrSquareTeamCard.store";
import DevsCard from "../../../components/DevsCard/DevsCard";
import DevsForm from "@ajholl/devsuikit/dist/DevsForm";
import DevsFormItem from "@ajholl/devsuikit/dist/DevsFormItem";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";
import DevsTextArea from "@ajholl/devsuikit/dist/DevsTextArea";

interface SqrSquareTeamCardProps extends StoreProps {
}

export class SqrSquareTeamCard extends React.Component<SqrSquareTeamCardProps> {
    readonly sqrSquareTeamCardStore: SqrSquareTeamCardStore = this.props.rootStore.sqrSquareTeamCardStore;

    render() {
        return <DevsCard title={this.sqrSquareTeamCardStore.title}
                         visible={this.sqrSquareTeamCardStore.visible}
                         loading={this.sqrSquareTeamCardStore.loading}
                         cardItemWasChanged={this.sqrSquareTeamCardStore.cardItemWasChanged}
                         onCloseBtnClicked={() => this.sqrSquareTeamCardStore.close()}
                         onCancelBtnClicked={() => this.sqrSquareTeamCardStore.close()}
                         modalStyle={{width: '500px', height: '300px'}}
                         onSaveBtnClicked={async () => await this.sqrSquareTeamCardStore.save()}
        >
            <DevsForm labelflex={2} inputflex={5}>
                <DevsFormItem label="Системное имя">
                    <DevsInput keyFilter="alphanum"
                               value={this.sqrSquareTeamCardStore.sqrTeam.name}
                               onChange={(event) => this.sqrSquareTeamCardStore.setName(event.target.value)}
                    />
                </DevsFormItem>
                <DevsFormItem label="Наименование">
                    <DevsInput value={this.sqrSquareTeamCardStore.sqrTeam.caption}
                               onChange={(event) => this.sqrSquareTeamCardStore.setCaption(event.target.value)}
                    />
                </DevsFormItem>
                <DevsFormItem label="Описание">
                    <DevsTextArea value={this.sqrSquareTeamCardStore.sqrTeam.description}
                                  onChange={(event) => this.sqrSquareTeamCardStore.setDescription(event.target.value)}
                    />
                </DevsFormItem>
            </DevsForm>
        </DevsCard>;
    }
}

const OSqrSquareTeamCard = observer(SqrSquareTeamCard);
export default OSqrSquareTeamCard;
import React from "react";
import {observer} from "mobx-react";
import {StoreProps} from "../../../interfaces/StoreProps";
import './SqrRoleCard.scss';
import DevsForm from "@ajholl/devsuikit/dist/DevsForm";
import DevsFormItem from "@ajholl/devsuikit/dist/DevsFormItem";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";
import DevsTextArea from "@ajholl/devsuikit/dist/DevsTextArea";
import DevsCard from "../../../components/DevsCard/DevsCard";
import {SqrRoleCardStore} from "./SqrRoleCard.store";

interface SqrRoleCardProps extends StoreProps {
}

export class SqrRoleCard extends React.Component<SqrRoleCardProps> {
    sqrRoleCardStore: SqrRoleCardStore = this.props.rootStore.sqrRoleCardStore;

    render() {
        return <DevsCard title={this.sqrRoleCardStore.title}
                         visible={this.sqrRoleCardStore.visible}
                         loading={this.sqrRoleCardStore.loading}
                         cardItemWasChanged={this.sqrRoleCardStore.cardItemWasChanged}
                         onCloseBtnClicked={() => this.sqrRoleCardStore.close()}
                         onCancelBtnClicked={() => this.sqrRoleCardStore.close()}
                         modalStyle={{width: '500px', height: '300px'}}
                         onSaveBtnClicked={async () => await this.sqrRoleCardStore.save()}
        >
            <DevsForm labelflex={2} inputflex={5}>
                <DevsFormItem label="Системное имя">
                    <DevsInput keyFilter="alphanum"
                               value={this.sqrRoleCardStore.sqrRole.name}
                               onChange={(event) => this.sqrRoleCardStore.setName(event.target.value)}
                    />
                </DevsFormItem>
                <DevsFormItem label="Наименование">
                    <DevsInput value={this.sqrRoleCardStore.sqrRole.caption}
                               onChange={(event) => this.sqrRoleCardStore.setCaption(event.target.value)}
                    />
                </DevsFormItem>
                <DevsFormItem label="Описание">
                    <DevsTextArea value={this.sqrRoleCardStore.sqrRole.description}
                                  onChange={(event) => this.sqrRoleCardStore.setDescription(event.target.value)}
                    />
                </DevsFormItem>
            </DevsForm>
        </DevsCard>;
    }
}

const OSqrRoleCard = observer(SqrRoleCard);
export default OSqrRoleCard;
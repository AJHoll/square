import './AdmUserCard.scss';
import React from "react";
import {StoreProps} from "../../../interfaces/StoreProps";
import {observer} from "mobx-react";
import AdmUserCardStore from "./AdmUserCard.store";
import DevsCard from "../../../components/DevsCard/DevsCard";
import DevsForm from "@ajholl/devsuikit/dist/DevsForm";
import DevsFormItem from "@ajholl/devsuikit/dist/DevsFormItem";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";
import DevsPassword from "@ajholl/devsuikit/dist/DevsPassword";

interface AdmUserCardProps extends StoreProps {
}

export class AdmUserCard extends React.Component<AdmUserCardProps> {
    readonly admUserCardStore: AdmUserCardStore = this.props.rootStore.admUserCardStore;

    render() {
        return <DevsCard title={this.admUserCardStore.title}
                         visible={this.admUserCardStore.visible}
                         loading={this.admUserCardStore.loading}
                         cardItemWasChanged={this.admUserCardStore.cardItemWasChanged}
                         onCloseBtnClicked={() => this.admUserCardStore.close()}
                         onCancelBtnClicked={() => this.admUserCardStore.close()}
                         modalStyle={{width: '500px', height: '300px'}}
                         onSaveBtnClicked={async () => await this.admUserCardStore.save()}
        >
            <DevsForm labelflex={2}
                      inputflex={5}
            >
                <DevsFormItem label="Системное имя">
                    <DevsInput keyFilter="alphanum"
                               value={this.admUserCardStore.admUser.name}
                               onChange={(event) =>
                                   this.admUserCardStore.setName(event.target.value)}
                    />
                </DevsFormItem>
                <DevsFormItem label="Наименование">
                    <DevsInput value={this.admUserCardStore.admUser.caption}
                               onChange={(event) =>
                                   this.admUserCardStore.setCaption(event.target.value)}
                    />
                </DevsFormItem>
                <DevsFormItem label="Пароль">
                    <DevsPassword value={this.admUserCardStore.admUser.password}
                                  disabled={(this.admUserCardStore.admUser?.id ?? 0) > 0}
                                  onChange={(event) =>
                                      this.admUserCardStore.setPassword(event.target.value)}
                    />
                </DevsFormItem>
            </DevsForm>
        </DevsCard>;
    }
}

const OAdmUserCard = observer(AdmUserCard);
export default OAdmUserCard;
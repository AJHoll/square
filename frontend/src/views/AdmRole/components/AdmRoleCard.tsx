import React from 'react';
import { observer } from 'mobx-react';
import { StoreProps } from '../../../interfaces/StoreProps';
import './AdmRoleCard.scss';
import DevsCard from '../../../components/DevsCard/DevsCard';
import DevsForm from '@ajholl/devsuikit/dist/DevsForm';
import DevsFormItem from '@ajholl/devsuikit/dist/DevsFormItem';
import DevsInput from '@ajholl/devsuikit/dist/DevsInput';
import DevsTextArea from '@ajholl/devsuikit/dist/DevsTextArea';
import AdmRoleCardStore from './AdmRoleCard.store';

interface AdmRoleCardProps extends StoreProps {
}

export class AdmRoleCard extends React.Component<AdmRoleCardProps> {
  adnRoleCardStore: AdmRoleCardStore = this.props.rootStore.admRoleCardStore;

  render() {
    return (<>
      <DevsCard title={this.adnRoleCardStore.title}
                visible={this.adnRoleCardStore.visible}
                loading={this.adnRoleCardStore.loading}
                cardItemWasChanged={this.adnRoleCardStore.cardItemWasChanged}
                onCloseBtnClicked={() => this.adnRoleCardStore.close()}
                onCancelBtnClicked={() => this.adnRoleCardStore.close()}
                modalStyle={{ width: '500px', height: '300px' }}
                onSaveBtnClicked={async () => await this.adnRoleCardStore.save()}
      >
        <DevsForm labelflex={2} inputflex={5}>
          <DevsFormItem label="Системное имя">
            <DevsInput keyFilter="alphanum"
                       value={this.adnRoleCardStore.admRole.name}
                       onChange={(event) => this.adnRoleCardStore.setName(event.target.value)}
            />
          </DevsFormItem>
          <DevsFormItem label="Наименование">
            <DevsInput value={this.adnRoleCardStore.admRole.caption}
                       onChange={(event) => this.adnRoleCardStore.setCaption(event.target.value)}
            />
          </DevsFormItem>
          <DevsFormItem label="Описание">
            <DevsTextArea value={this.adnRoleCardStore.admRole.caption}
                          onChange={(event) => this.adnRoleCardStore.setDescription(event.target.value)}
            />
          </DevsFormItem>
        </DevsForm>
      </DevsCard>
    </>);
  }
}

const OAdmRoleCard = observer(AdmRoleCard);
export default OAdmRoleCard;
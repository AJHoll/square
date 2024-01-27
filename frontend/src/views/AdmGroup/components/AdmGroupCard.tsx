import './AdmGroupCard.scss';
import React from 'react';
import DevsCard from '../../../components/DevsCard/DevsCard';
import { observer } from 'mobx-react';
import { StoreProps } from '../../../interfaces/StoreProps';
import DevsForm from '@ajholl/devsuikit/dist/DevsForm';
import DevsFormItem from '@ajholl/devsuikit/dist/DevsFormItem';
import DevsInput from '@ajholl/devsuikit/dist/DevsInput';
import DevsTextArea from '@ajholl/devsuikit/dist/DevsTextArea';
import AdmGroupCardStore from './AdmGroupCard.store';

interface AdmGroupCardProps extends StoreProps {
}

export class AdmGroupCard extends React.Component<AdmGroupCardProps> {
  readonly admGroupCardStore: AdmGroupCardStore = this.props.rootStore.admGroupCardStore;

  render() {
    return <DevsCard title={this.admGroupCardStore.title}
                     visible={this.admGroupCardStore.visible}
                     loading={this.admGroupCardStore.loading}
                     cardItemWasChanged={this.admGroupCardStore.cardItemWasChanged}
                     onCloseBtnClicked={() => this.admGroupCardStore.close()}
                     onCancelBtnClicked={() => this.admGroupCardStore.close()}
                     modalStyle={{ width: '500px', height: '300px' }}
                     onSaveBtnClicked={async () => await this.admGroupCardStore.save()}
    >
      <DevsForm labelflex={2} inputflex={5}>
        <DevsFormItem label="Системное имя">
          <DevsInput keyFilter="alphanum"
                     value={this.admGroupCardStore.admGroup.name}
                     onChange={(event) => this.admGroupCardStore.setName(event.target.value)}
          />
        </DevsFormItem>
        <DevsFormItem label="Наименование">
          <DevsInput value={this.admGroupCardStore.admGroup.caption}
                     onChange={(event) => this.admGroupCardStore.setCaption(event.target.value)}
          />
        </DevsFormItem>
        <DevsFormItem label="Описание">
          <DevsTextArea value={this.admGroupCardStore.admGroup.caption}
                        onChange={(event) => this.admGroupCardStore.setDescription(event.target.value)}
          />
        </DevsFormItem>
      </DevsForm>
    </DevsCard>;
  }
}

const OAdmGroupCard = observer(AdmGroupCard);
export default OAdmGroupCard;
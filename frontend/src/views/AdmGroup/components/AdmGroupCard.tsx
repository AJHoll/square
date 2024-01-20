import './AdmGroupCard.scss';
import React from 'react';
import DevsCard from '../../../components/DevsCard/DevsCard';
import { observer } from 'mobx-react';
import { StoreProps } from '../../../interfaces/StoreProps';

interface AdmGroupCardProps extends StoreProps {
}

export class AdmGroupCard extends React.Component<AdmGroupCardProps> {
  render() {
    return (
      <DevsCard visible={false}></DevsCard>
    );
  }
}

const OAdmGroupCard = observer(AdmGroupCard);
export default OAdmGroupCard;
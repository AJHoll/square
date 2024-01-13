import './DevsCard.scss';
import React, { CSSProperties } from 'react';
import DevsModal from '@ajholl/devsuikit/dist/DevsModal';
import DevsButton from '@ajholl/devsuikit/dist/DevsButton';

export interface UniversalCardProps {
  visible?: boolean;
  title?: string | React.ReactElement;
  children?: React.ReactElement | React.ReactElement[];
  loading?: boolean;
  cardItemWasChanged?: boolean;
  onSaveBtnClicked?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onCloseBtnClicked?: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onCancelBtnClicked?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  modalClassName?: string;
  modalStyle?: CSSProperties
}

export default class DevsCard extends React.Component<UniversalCardProps> {
  render() {
    const {
      visible, title,
      children, loading,
      cardItemWasChanged, modalClassName, modalStyle,
    } = this.props;
    const { onSaveBtnClicked, onCloseBtnClicked, onCancelBtnClicked } = this.props;
    return (
      <DevsModal appendTo="#window__content"
                 visible={visible ?? false}
                 title={title ?? ''}
                 className={modalClassName}
                 style={modalStyle}
                 onClose={() => {
                   if (onCloseBtnClicked !== undefined) {
                     onCloseBtnClicked();
                   }
                 }}
                 footer={
                   (
                     <div className="app_universal_card__footer">
                       <DevsButton template="filled"
                                   color="success"
                                   title="Сохранить"
                                   icon="lni lni-checkmark"
                                   disabled={loading || !cardItemWasChanged}
                                   onClick={onSaveBtnClicked}
                       />
                       <DevsButton template="filled"
                                   color={cardItemWasChanged ? 'danger' : 'secondary'}
                                   title={cardItemWasChanged ? 'Отменить' : 'Закрыть'}
                                   icon="lni lni-close"
                                   disabled={loading}
                                   onClick={(event) => {
                                     if (cardItemWasChanged) {
                                       if (onCancelBtnClicked !== undefined) {
                                         onCancelBtnClicked(event);
                                       }
                                     } else if (onCloseBtnClicked !== undefined) {
                                       onCloseBtnClicked(event);
                                     }
                                   }}
                       />
                     </div>
                   )
                 }
      >
        {children}
      </DevsModal>
    );
  }
}

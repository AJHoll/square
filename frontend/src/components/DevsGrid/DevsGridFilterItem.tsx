import './DevsGridFilterItem.scss';
import React from 'react';
import DevsInput from '@ajholl/devsuikit/dist/DevsInput';
import DevsCalendar from '@ajholl/devsuikit/dist/DevsCalendar';
import DevsCheckbox from '@ajholl/devsuikit/dist/DevsCheckbox';

export type UFilterType = 'boolean' | 'string' | 'number' | 'date';

export interface UFilterItem {
  fieldName: string;
  fieldTitle?: string;
  type: UFilterType;
  value?: boolean | number | string | Date;
}

interface UniversalFilterItemProps extends UFilterItem {
  onValueChanged?: (changedValue: UFilterItem) => void;
}

export default class DevsGridFilterItem extends React.Component<UniversalFilterItemProps> {
  render() {
    const { fieldName, fieldTitle, type, value, onValueChanged } = this.props;
    switch (type) {
      case 'string': {
        return (
          <DevsInput placeholder={fieldTitle}
                     value={(value as unknown as string)}
                     onChange={(event) => {
                       if (onValueChanged !== undefined) {
                         onValueChanged({
                           fieldName,
                           fieldTitle,
                           type,
                           value: event.target.value,
                         });
                       }
                     }}
          />
        );
      }
      case 'number': {
        return (
          <DevsInput keyFilter="num"
                     placeholder={fieldTitle}
                     value={(value as unknown as string)}
                     onChange={(event) => {
                       if (onValueChanged !== undefined) {
                         onValueChanged({
                           fieldName,
                           fieldTitle,
                           type,
                           value: +event.target.value,
                         });
                       }
                     }}
          />
        );
      }
      case 'date': {
        return (
          <DevsCalendar placeholder={fieldTitle}
                        appendTo={document.querySelector<HTMLElement>('.devs_block_ui')}
                        value={(value as unknown as Date)}
                        onChange={(event) => {
                          if (onValueChanged !== undefined) {
                            onValueChanged({
                              fieldName,
                              fieldTitle,
                              type,
                              value: (event.target.value as Date),
                            });
                          }
                        }}
          />
        );
      }
      case 'boolean': {
        return (
          <DevsCheckbox value={(value as unknown as boolean)}
                        style={{ justifyContent: 'left' }}
                        labelSide="right"
                        onChange={(event) => {
                          if (onValueChanged !== undefined) {
                            onValueChanged({
                              fieldName,
                              fieldTitle,
                              type,
                              value: (event.checked),
                            });
                          }
                        }}
          />
        );
      }
      default: {
        return 'no-type value';
      }
    }
  }
}

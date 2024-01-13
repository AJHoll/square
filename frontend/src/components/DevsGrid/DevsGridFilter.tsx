import './DevsGridFilter.scss';
import React from 'react';
import DevsGridFilterItem, { UFilterItem } from './DevsGridFilterItem';
import DevsForm from '@ajholl/devsuikit/dist/DevsForm';
import DevsButton from '@ajholl/devsuikit/dist/DevsButton';
import DevsFormItem from '@ajholl/devsuikit/dist/DevsFormItem';

interface UniversalFilterProps {
  defaultFilterValue: { [key: string]: UFilterItem };
  onConfirm: (filters: { [key: string]: UFilterItem }) => void;
  labelflex?: number;
  inputflex?: number;
}

interface UniversalFilterState {
  filters: { [key: string]: UFilterItem };
}

export default class DevsGridFilter extends React.Component<UniversalFilterProps, UniversalFilterState> {
  constructor(props: UniversalFilterProps) {
    super(props);

    this.state = {
      filters: { ...this.props.defaultFilterValue },
    };
  }

  render() {
    const { filters } = this.state;
    const { labelflex, inputflex } = this.props;
    return (
      <div className="app_universal_filter">
        <DevsForm labelflex={labelflex} inputflex={inputflex}>
          <div className="app_universal_filter__content">
            {Object.keys(filters).map((filterKey) => {
              const { fieldName, fieldTitle, type, value } = filters[filterKey];
              return (
                filterKey !== 'fast_filter'
                  ? (
                    <DevsFormItem key={fieldName} label={fieldTitle ?? ''}>
                      <DevsGridFilterItem key={fieldName}
                                          fieldName={fieldName}
                                          fieldTitle={fieldTitle}
                                          type={type}
                                          value={value}
                                          onValueChanged={(changedValue) => {
                                             for (const filterName in filters) {
                                               if (filterName === changedValue.fieldName) {
                                                 filters[filterName].value = changedValue.value;
                                               }
                                             }
                                           }}
                      />
                    </DevsFormItem>
                  ) : ''
              );
            })}
          </div>
        </DevsForm>
        <div className="app_universal_filter__footer">
          <DevsButton template="filled"
                      color="primary"
                      icon="lni lni-save"
                      title="Применить"
                      onClick={() => {
                        this.props.onConfirm(filters);
                      }}
          />
        </div>
      </div>
    );
  }
}

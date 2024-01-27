import './AdmGroup.scss';
import React from 'react';
import { StoreProps } from '../../../interfaces/StoreProps';
import { observer } from 'mobx-react';
import DevsGrid from '../../../components/DevsGrid/DevsGrid';
import AdmGroupStore from './AdmGroup.store';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AdmGroupDto } from '../../../dtos/AdmGroup.dto';

interface AdmGroupProps extends StoreProps {
}

export class AdmGroup extends React.Component<AdmGroupProps> {
  admGroupStore: AdmGroupStore = this.props.rootStore.admGroupStore;

  defaultColDef: ColDef<AdmGroupDto> = {
    flex: 1,
    resizable: true,
    filter: true,
    sortable: true,
  }

  colDef: ColDef<AdmGroupDto>[] = [
    {
      field: 'name',
      headerName: 'Системное имя',
    },
    {
      field: 'caption',
      headerName: 'Наименование',
    },
    {
      field: 'description',
      headerName: 'Описание',
    },
  ]

  async onGridReady(event: GridReadyEvent): Promise<void> {
    this.admGroupStore.gridApi = event.api;
    this.admGroupStore.columnApi = event.columnApi;
    await this.admGroupStore.reloadGroups();
  }

  render() {
    return <DevsGrid gridColDef={this.colDef}
                     gridDefaultColDef={this.defaultColDef}
                     createBtnTitle="Создать"
                     editBtnTitle="Редактировать"
                     deleteBtnTitle="Удалить"
                     gridRowSelection="multiple"
                     editBtnDisabled={this.admGroupStore.editBtnDisabled}
                     deleteBtnDisabled={this.admGroupStore.deleteBtnDisabled}
                     onGridReady={async (event) => this.onGridReady(event)}
                     onGridRowSelectionChanged={async (event) => this.admGroupStore.groupSelectionChange(event)}
                     onCreateBtnClicked={() => this.admGroupStore.createNewGroup()}
                     onEditBtnClicked={() => this.admGroupStore.editGroup()}
                     onDeleteBtnClicked={() => this.admGroupStore.deleteGroups()}
                     onGridRowDoubleClicked={() => !this.admGroupStore.editBtnDisabled ? this.admGroupStore.editGroup() : undefined}
    />;
  }
}

const OAdmGroup = observer(AdmGroup);
export default OAdmGroup;
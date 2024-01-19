import React from 'react';
import { observer } from 'mobx-react';
import './AdmRole.scss';
import { StoreProps } from '../../../interfaces/StoreProps';
import DevsGrid from '../../../components/DevsGrid/DevsGrid';
import AdmRoleStore from './AdmRole.store';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AdmRoleDto } from '../../../dtos/AdmRole.dto';

export interface AdmRoleViewProps extends StoreProps {
}

export class AdmRole extends React.Component<AdmRoleViewProps> {


  admRoleStore: AdmRoleStore = this.props.rootStore.admRoleStore;

  defaultColDef: ColDef<AdmRoleDto> = {
    flex: 1,
    resizable: true,
    filter: true,
    sortable: true,
  }
  colDef: ColDef<AdmRoleDto>[] = [
    {
      field: 'id',
      headerName: 'ID',
      hide: true,
    },
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

  async onGridReady(event: GridReadyEvent<AdmRoleDto>): Promise<void> {
    this.admRoleStore.gridApi = event.api;
    this.admRoleStore.columnApi = event.columnApi;
    await this.admRoleStore.reloadRoles();
  }

  render() {
    return <DevsGrid gridColDef={this.colDef}
                     gridDefaultColDef={this.defaultColDef}
                     createBtnTitle="Создать"
                     editBtnTitle="Редактировать"
                     deleteBtnTitle="Удалить"
                     gridRowSelection="multiple"
                     editBtnDisabled={this.admRoleStore.editBtnDisabled}
                     deleteBtnDisabled={this.admRoleStore.deleteBtnDisabled}
                     onGridReady={(event) => this.onGridReady(event)}
                     onGridRowSelectionChanged={(event) => this.admRoleStore.roleSelectionChange(event)}
                     onCreateBtnClicked={() => this.admRoleStore.createNewRole()}
                     onEditBtnClicked={() => this.admRoleStore.editRole()}
                     onDeleteBtnClicked={() => this.admRoleStore.deleteRole()}
                     onGridRowDoubleClicked={() => this.admRoleStore.editRole()}
    />;
  }
}

const OAdmRole = observer(AdmRole);
export default OAdmRole;
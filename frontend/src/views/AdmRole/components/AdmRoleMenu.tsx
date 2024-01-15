import React from 'react';
import { StoreProps } from '../../../interfaces/StoreProps';
import { observer } from 'mobx-react';
import './AdmRoleMenu.scss';
import AdmRoleMenuStore from './AdmRoleMenu.store';
import DevsGrid from '../../../components/DevsGrid/DevsGrid';
import { ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { AdmRoleDto } from '../../../dtos/AdmRole.dto';
import { AdmRoleMenuDto } from '../../../dtos/AdmRoleMenu.dto';

interface AdmRoleMenuProps extends StoreProps {
}

export class AdmRoleMenu extends React.Component<AdmRoleMenuProps> {
  admRoleMenuStore: AdmRoleMenuStore = this.props.rootStore.admRoleMenuStore;

  defaultColDef: ColDef<AdmRoleDto> = {
    flex: 1,
    resizable: true,
    filter: true,
    sortable: true,
  }
  colDef: ColDef<AdmRoleMenuDto>[] = [
    {
      field: 'id',
      headerName: 'ID',
      hide: true,
    },
    {
      field: 'menuItem.group.title',
      headerName: 'Группа',
    },
    {
      field: 'menuItem.title',
      headerName: 'Наименование',
    },
    {
      field: 'menuItem.url',
      headerName: 'URL',
    },
    {
      field: 'menuItem.icon',
      headerName: 'Иконка',
      cellRenderer: (params: ICellRendererParams) => <i className={params.value}></i>
    },
  ]

  async onGridReady(event: GridReadyEvent<AdmRoleMenuDto>): Promise<void> {
    this.admRoleMenuStore.gridApi = event.api;
    this.admRoleMenuStore.columnApi = event.columnApi;
    await this.admRoleMenuStore.reloadRoles();
  }

  render() {
    return (
      <>
        <DevsGrid gridDefaultColDef={this.defaultColDef}
                  gridColDef={this.colDef}
                  onGridReady={async (event) => await this.onGridReady(event)}
        />
      </>
    );
  }
}

const OAdmRoleMenu = observer(AdmRoleMenu);
export default OAdmRoleMenu;
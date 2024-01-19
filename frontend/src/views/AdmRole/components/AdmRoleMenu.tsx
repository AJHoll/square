import React from 'react';
import { StoreProps } from '../../../interfaces/StoreProps';
import { observer } from 'mobx-react';
import './AdmRoleMenu.scss';
import AdmRoleMenuStore from './AdmRoleMenu.store';
import DevsGrid from '../../../components/DevsGrid/DevsGrid';
import { ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { AdmRoleDto } from '../../../dtos/AdmRole.dto';
import { AdmRoleMenuDto } from '../../../dtos/AdmRoleMenu.dto';
import DevsSplitterPanel from '@ajholl/devsuikit/dist/DevsSplitterPanel';
import DevsSplitter from '@ajholl/devsuikit/dist/DevsSplitter';
import DevsButton from '@ajholl/devsuikit/dist/DevsButton';
import { KrnMenuItemDto } from '../../../dtos/KrnMenuItem.dto';

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
  roleMenuColDef: ColDef<AdmRoleMenuDto>[] = [
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
      cellRenderer: (params: ICellRendererParams) => <i className={params.value}></i>,
    },
  ]

  menuColDef: ColDef<KrnMenuItemDto>[] = [
    {
      field: 'id',
      headerName: 'ID',
      hide: true,
    },
    {
      field: 'group.title',
      headerName: 'Группа',
    },
    {
      field: 'title',
      headerName: 'Наименование',
    },
    {
      field: 'url',
      headerName: 'URL',
    },
    {
      field: 'icon',
      headerName: 'Иконка',
      cellRenderer: (params: ICellRendererParams) => <i className={params.value}></i>,
    },
  ]

  async onRoleMenuGridReady(event: GridReadyEvent<AdmRoleMenuDto>): Promise<void> {
    this.admRoleMenuStore.roleMenuGridApi = event.api;
    await this.admRoleMenuStore.reloadRoleMenuItems();
  }

  async onMenuItemsGridReady(event: GridReadyEvent<KrnMenuItemDto>): Promise<void> {
    this.admRoleMenuStore.menuGridApi = event.api;
    await this.admRoleMenuStore.reloadMenuItems();
  }

  render() {
    return (
      <DevsSplitter layout="horizontal">
        <DevsSplitterPanel>
          <DevsGrid title="Пункты меню роли"
                    gridDefaultColDef={{ ...this.defaultColDef }}
                    gridColDef={this.roleMenuColDef}
                    gridRowSelection="multiple"
                    onGridReady={async (event) => await this.onRoleMenuGridReady(event)}
                    onGridRowSelectionChanged={(event) => this.admRoleMenuStore.roleMenuItemSelectionChange(event)}
          />
        </DevsSplitterPanel>
        <DevsSplitterPanel>
          <div className="all_menu">
            <div className="all_menu__button_bar">
              <DevsButton template="filled"
                          color="primary"
                          icon="lni lni-arrow-left"
                          disabled={this.admRoleMenuStore.addMenuItemToRoleBtnDisabled}
                          onClick={() => this.admRoleMenuStore.addMenuItemToRole()}
              />
              <DevsButton template="filled"
                          color="primary"
                          icon="lni lni-arrow-right"
                          disabled={this.admRoleMenuStore.removeMenuItemsFromRoleBtnDisabled}
                          onClick={() => this.admRoleMenuStore.removeMenuItemsFromRole()}
              />
            </div>
            <div className="all_menu__grid">
              <DevsGrid title="Пункты меню"
                        gridDefaultColDef={{ ...this.defaultColDef }}
                        gridColDef={this.menuColDef}
                        gridRowSelection="multiple"
                        onGridReady={async (event) => await this.onMenuItemsGridReady(event)}
                        onGridRowSelectionChanged={(event) => this.admRoleMenuStore.menuItemSelectionChange(event)}
              />
            </div>
          </div>
        </DevsSplitterPanel>
      </DevsSplitter>
    );
  }
}

const OAdmRoleMenu = observer(AdmRoleMenu);
export default OAdmRoleMenu;
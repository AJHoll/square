import './AdmGroupRole.scss';
import React from 'react';
import { StoreProps } from '../../../interfaces/StoreProps';
import { observer } from 'mobx-react';
import DevsSplitterPanel from '@ajholl/devsuikit/dist/DevsSplitterPanel';
import DevsGrid from '../../../components/DevsGrid/DevsGrid';
import DevsButton from '@ajholl/devsuikit/dist/DevsButton';
import DevsSplitter from '@ajholl/devsuikit/dist/DevsSplitter';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AdmGroupDto } from '../../../dtos/AdmGroup.dto';
import { AdmRoleDto } from '../../../dtos/AdmRole.dto';
import { AdmGroupRoleDto } from '../../../dtos/AdmGroupRole.dto';
import AdmGroupRoleStore from './AdmGroupRole.store';

interface AdmGroupRoleProps extends StoreProps {
}

export class AdmGroupRole extends React.Component<AdmGroupRoleProps> {

  admGroupRoleStore: AdmGroupRoleStore = this.props.rootStore.admGroupRoleStore;

  defaultColDef: ColDef<AdmGroupDto> = {
    flex: 1,
    resizable: true,
    filter: true,
    sortable: true,
  }

  groupRoleColDef: ColDef<AdmGroupRoleDto>[] = [
    {
      field: 'role.name',
      headerName: 'Системное имя',
    },
    {
      field: 'role.caption',
      headerName: 'Наименование',
    },
    {
      field: 'role.description',
      headerName: 'Описание',
    },
  ]
  roleColDef: ColDef<AdmRoleDto>[] = [
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

  async onGroupRoleGridReady(event: GridReadyEvent<AdmGroupRoleDto>): Promise<void> {

  }

  async onRoleGridReady(event: GridReadyEvent<AdmRoleDto>): Promise<void> {

  }

  render() {
    return <DevsSplitter layout="horizontal">
      <DevsSplitterPanel>
        <DevsGrid title="Роли группы"
                  gridDefaultColDef={this.defaultColDef}
                  gridColDef={this.groupRoleColDef}
                  gridRowSelection="multiple"
                  onGridReady={async (event) => await this.onGroupRoleGridReady(event)}
                  onGridRowSelectionChanged={(event) => this.admGroupRoleStore.groupRoleSelectionChange(event)}
        />
      </DevsSplitterPanel>
      <DevsSplitterPanel>
        <div className="all_menu">
          <div className="all_menu__button_bar">
            <DevsButton template="filled"
                        color="primary"
                        icon="lni lni-arrow-left"
                        disabled={this.admGroupRoleStore.addRoleToGroupBtnDisabled}
                        onClick={() => this.admGroupRoleStore.addRoletoGroup()}
            />
            <DevsButton template="filled"
                        color="primary"
                        icon="lni lni-arrow-right"
                        disabled={this.admGroupRoleStore.removeRoleFromGroupBtnDisabled}
                        onClick={() => this.admGroupRoleStore.removeRoleFromGroup()}
            />
          </div>
          <div className="all_menu__grid">
            <DevsGrid title="Роли"
                      gridDefaultColDef={this.defaultColDef}
                      gridColDef={this.roleColDef}
                      gridRowSelection="multiple"
                      onGridReady={async (event) => await this.onRoleGridReady(event)}
                      onGridRowSelectionChanged={(event) => this.admGroupRoleStore.roleSelectionChange(event)}
            />
          </div>
        </div>
      </DevsSplitterPanel>
    </DevsSplitter>
  }
}

const OAdmGroupRole = observer(AdmGroupRole);
export default OAdmGroupRole;
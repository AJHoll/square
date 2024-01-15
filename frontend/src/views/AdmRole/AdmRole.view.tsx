import React from 'react';
import { BaseViewProps } from '../../interfaces/BaseViewProps';
import { observer } from 'mobx-react';
import './AdmRole.view.scss';
import DevsGrid from '../../components/DevsGrid/DevsGrid';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import ViewHeader from '../../components/ViewHeader/ViewHeader';
import DevsTabView from '@ajholl/devsuikit/dist/DevsTabView';
import DevsTabPanel from '@ajholl/devsuikit/dist/DevsTabPanel';
import DevsSplitter from '@ajholl/devsuikit/dist/DevsSplitter';
import DevsSplitterPanel from '@ajholl/devsuikit/dist/DevsSplitterPanel';
import OAdmRoleMenu from './components/AdmRoleMenu';
import AdmRoleStore from './AdmRole.store';
import { AdmRoleDto } from '../../dtos/AdmRole.dto';
import { AdmRoleCard } from './components/AdmRoleCard';

export interface AdmRoleViewProps extends BaseViewProps {
}

export class AdmRoleView extends React.Component<AdmRoleViewProps> {

  readonly title = 'Управление ролями';
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

  componentDidMount() {
    document.title = this.props.title;
  }

  async onGridReady(event: GridReadyEvent<AdmRoleDto>): Promise<void> {
    this.admRoleStore.gridApi = event.api;
    this.admRoleStore.columnApi = event.columnApi;
    await this.admRoleStore.reloadRoles();
  }

  render() {
    const { title, defaultColDef, colDef } = this;
    return (<div className="adm_role_view">
        <AdmRoleCard rootStore={this.props.rootStore} />
        <ViewHeader title={title} />
        <div className="adm_role_view__content">
          <DevsSplitter layout="vertical">
            <DevsSplitterPanel>
              <DevsGrid gridColDef={colDef}
                        gridDefaultColDef={defaultColDef}
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
              />
            </DevsSplitterPanel>
            <DevsSplitterPanel>
              <DevsTabView>
                <DevsTabPanel header="Пункты меню">
                  <OAdmRoleMenu rootStore={this.props.rootStore} />
                </DevsTabPanel>
              </DevsTabView>
            </DevsSplitterPanel>
          </DevsSplitter>
        </div>
      </div>
    );
  }
}

const OAdmRoleView = observer(AdmRoleView);
export default OAdmRoleView;
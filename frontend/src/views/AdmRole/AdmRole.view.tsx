import React from 'react';
import { BaseViewProps } from '../../interfaces/BaseViewProps';
import { observer } from 'mobx-react';
import './AdmRole.view.scss';
import DevsGrid from '../../components/DevsGrid/DevsGrid';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import ViewHeader from '../../components/ViewHeader/ViewHeader';

export interface AdmRoleViewProps extends BaseViewProps {
}

export class AdmRoleView extends React.Component<AdmRoleViewProps> {
  readonly title = 'Управление ролями'
  gridApi?: GridApi;
  columnApi?: ColumnApi;
  colDef: ColDef[] = [
    {
      field: 't1',
      headerName: 'Тест колонки',
    },
  ]

  componentDidMount() {
    document.title = this.props.title;
  }

  async onGridReady(event: GridReadyEvent<any>): Promise<void> {
    this.gridApi = event.api;
    this.columnApi = event.columnApi;
    setTimeout(() => {
      this.gridApi?.setRowData([{ t1: 'hello World' }])
    }, 1000)
  }

  render() {
    const { title, colDef } = this;
    return (<div className="adm_role_view">
        <ViewHeader title={this.title} />
        <div className="adm_role_view__content">
          <DevsGrid gridColDef={colDef}
                    onGridReady={(event) => this.onGridReady(event)}
          />
        </div>
      </div>
    );
  }
}

const OAdmRoleView = observer(AdmRoleView);
export default OAdmRoleView;
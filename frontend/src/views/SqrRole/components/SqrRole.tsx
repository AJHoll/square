import {StoreProps} from "../../../interfaces/StoreProps";
import React from "react";
import {observer} from "mobx-react";
import './SqrRole.scss';
import {ColDef, GridReadyEvent} from "ag-grid-community";
import DevsGrid from "../../../components/DevsGrid/DevsGrid";
import {SqrRoleStore} from "./SqrRole.store";
import {SqrRoleDto} from "../../../dtos/SqrRole.dto";

export interface SqrRoleProps extends StoreProps {
}

export class SqrRole extends React.Component<SqrRoleProps> {

    readonly sqrRoleStore: SqrRoleStore = this.props.rootStore.sqrRoleStore;

    defaultColDef: ColDef<SqrRoleDto> = {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: true,
    }
    colDef: ColDef<SqrRoleDto>[] = [
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

    async onGridReady(event: GridReadyEvent): Promise<void> {
        this.sqrRoleStore.gridApi = event.api;
        this.sqrRoleStore.columnApi = event.columnApi;
        await this.sqrRoleStore.reloadRoles();
    }

    render() {
        return <DevsGrid gridColDef={this.colDef}
                         gridDefaultColDef={this.defaultColDef}
                         createBtnTitle="Создать"
                         editBtnTitle="Редактировать"
                         deleteBtnTitle="Удалить"
                         gridRowSelection="multiple"
                         editBtnDisabled={this.sqrRoleStore.editBtnDisabled}
                         deleteBtnDisabled={this.sqrRoleStore.deleteBtnDisabled}
                         onGridReady={(event) => this.onGridReady(event)}
                         onGridRowSelectionChanged={(event) => this.sqrRoleStore.roleSelectionChange(event)}
                         onCreateBtnClicked={() => this.sqrRoleStore.createNewRole()}
                         onEditBtnClicked={() => this.sqrRoleStore.editRole()}
                         onDeleteBtnClicked={() => this.sqrRoleStore.deleteRole()}
                         onGridRowDoubleClicked={() => !this.sqrRoleStore.editBtnDisabled ? this.sqrRoleStore.editRole() : undefined}
        />;
    }
}

const OSqrRole = observer(SqrRole);
export default OSqrRole;
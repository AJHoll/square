import {StoreProps} from "../../../interfaces/StoreProps";
import React from "react";
import {observer} from "mobx-react";
import './SqrSquareUser.scss';
import DevsSplitter from "@ajholl/devsuikit/dist/DevsSplitter";
import DevsSplitterPanel from "@ajholl/devsuikit/dist/DevsSplitterPanel";
import DevsGrid from "../../../components/DevsGrid/DevsGrid";
import {ColDef, GridReadyEvent} from "ag-grid-community";
import {SqrRoleDto} from "../../../dtos/SqrRole.dto";
import {SqrSquareUserDto} from "../../../dtos/SqrSquareUser.dto";
import SqrSquareUserStore from "./SqrSquareUser.store";

interface SqrSquareUserProps extends StoreProps {
}

export class SqrSquareUser extends React.Component<SqrSquareUserProps> {
    readonly sqrSquareUserStore: SqrSquareUserStore = this.props.rootStore.sqrSquareUserStore;

    defaultColDef: ColDef = {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: true,
    }
    sqrRolesColDef: ColDef<SqrRoleDto>[] = [
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

    squareUserColDef: ColDef<SqrSquareUserDto>[] = [
        {
            field: 'name',
            headerName: 'Системное имя',
        },
        {
            field: 'caption',
            headerName: 'Наименование',
        },
        {
            field: "activeInSquareRole",
            headerName: 'Используется'
        }
    ]

    async onSqrRoleGridReady(event: GridReadyEvent<SqrRoleDto>): Promise<void> {
        this.sqrSquareUserStore.sqrRolesGridApi = event.api;
        event.api.setRowData([]);
    }

    async onSquareUserGridReady(event: GridReadyEvent<SqrSquareUserDto>): Promise<void> {
        this.sqrSquareUserStore.squareUserGridApi = event.api;
        event.api.setRowData([]);
    }

    render() {
        return <DevsSplitter layout="horizontal">
            <DevsSplitterPanel>
                <DevsGrid title="Роли на площадке"
                          gridDefaultColDef={this.defaultColDef}
                          gridColDef={this.sqrRolesColDef}
                          gridRowSelection="single"
                          onEditBtnClicked={async (event) => await this.sqrSquareUserStore.toggleMode()}
                          editBtnTitle={`Перевести в режим ${this.sqrSquareUserStore.mode === 'view' ? 'редактирования' : 'просмотра'}`}
                          editBtnIcon={this.sqrSquareUserStore.mode === 'view' ? 'lni lni-pencil' : 'lni lni-eye'}
                          editBtnDisabled={this.sqrSquareUserStore.modeBtnDisabled}
                          onGridReady={async (event) => await this.onSqrRoleGridReady(event)}
                          onGridRowSelectionChanged={(event) => this.sqrSquareUserStore.sqrRoleSelectionChange(event)}
                />
            </DevsSplitterPanel>
            <DevsSplitterPanel>
                <DevsGrid
                    title={this.sqrSquareUserStore.mode === 'view' ? `Пользователи роли: ${this.sqrSquareUserStore.selectionRoleCaption}` : 'Все пользователи'}
                    gridDefaultColDef={this.defaultColDef}
                    gridColDef={this.squareUserColDef}
                    gridRowSelection="multiple"
                    onGridReady={async (event) => await this.onSquareUserGridReady(event)}
                    onGridRowSelectionChanged={(event) => this.sqrSquareUserStore.squareUserSelectionChange(event)}
                    filters={this.sqrSquareUserStore.squareUserFilters}
                    fastFilterPlaceholder="Для поиска пользователя начните вводить ФИО"
                    onFilterConfirm={async (filters) => (await this.sqrSquareUserStore.onSquareUserFilterConfirm(filters))}
                    onCreateBtnClicked={async () => (await this.sqrSquareUserStore.addUsersToSquareRole())}
                    createBtnIcon="lni lni-plus"
                    createBtnDisabled={this.sqrSquareUserStore.addUsersToSquareRoleBtnDisabled}
                    onDeleteBtnClicked={async () => (await this.sqrSquareUserStore.removeUsersFromSquareRole())}
                    deleteBtnIcon="lni lni-minus"
                    deleteBtnDisabled={this.sqrSquareUserStore.removeUsersFromSquareRoleBtnDisabled}
                />
            </DevsSplitterPanel>
        </DevsSplitter>
    }
}

const OSqrSquareUser = observer(SqrSquareUser);
export default OSqrSquareUser;
import {StoreProps} from "../../../interfaces/StoreProps";
import React from "react";
import {observer} from "mobx-react";
import './SqrSquareTeam.scss';
import DevsSplitterPanel from "@ajholl/devsuikit/dist/DevsSplitterPanel";
import DevsGrid from "../../../components/DevsGrid/DevsGrid";
import DevsSplitter from "@ajholl/devsuikit/dist/DevsSplitter";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import {ColDef, GridReadyEvent} from "ag-grid-community";
import {SqrTeamDto} from "../../../dtos/SqrTeam.dto";
import {SqrSquareTeamUserDto} from "../../../dtos/SqrSquareTeamUserDto";
import SqrSquareTeamStore from "./SqrSquareTeam.store";
import OSqrSquareTeamCard from "./SqrSquareTeamCard";

interface SqrSquareParticipantProps extends StoreProps {
}

export class SqrSquareTeam extends React.Component<SqrSquareParticipantProps> {
    readonly sqrSquareTeamStore: SqrSquareTeamStore = this.props.rootStore.sqrSquareTeamStore;

    defaultColDef: ColDef = {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: true,
    }
    sqrTeamColDef: ColDef<SqrTeamDto>[] = [
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
        {
            field: 'result',
            headerName: 'Результат',
        }
    ]

    squareRoleUserColDef: ColDef<SqrSquareTeamUserDto>[] = [
        {
            field: 'user.name',
            headerName: 'Системное имя',
        },
        {
            field: 'user.caption',
            headerName: 'Наименование',
        },
        {
            field: 'role.caption',
            headerName: 'Роль',
        },
        {
            field: "user.activeInSquareRole",
            headerName: 'Используется'
        }
    ]

    async onSqrTeamGridReady(event: GridReadyEvent<SqrTeamDto>): Promise<void> {
        this.sqrSquareTeamStore.sqrTeamsGridApi = event.api;
        event.api.setRowData([]);
    }

    async onSquareRoleUserGridReady(event: GridReadyEvent<SqrSquareTeamUserDto>): Promise<void> {
        this.sqrSquareTeamStore.squareRoleUserGridApi = event.api;
        event.api.setRowData([]);
    }

    render() {
        return <DevsSplitter layout="horizontal">
            <DevsSplitterPanel>
                <OSqrSquareTeamCard rootStore={this.props.rootStore}/>
                <DevsGrid title="Команды"
                          gridDefaultColDef={this.defaultColDef}
                          gridColDef={this.sqrTeamColDef}
                          gridRowSelection="single"
                          onGridReady={async (event) => (await this.onSqrTeamGridReady(event))}
                          onGridRowSelectionChanged={(event) => this.sqrSquareTeamStore.onSqrTeamsSelectionChange(event)}
                          onCreateBtnClicked={() => this.sqrSquareTeamStore.createNewTeam()}
                          createBtnTitle="Создать"
                          createBtnDisabled={this.sqrSquareTeamStore.createTeamBtnDisabled}
                          onEditBtnClicked={() => this.sqrSquareTeamStore.editTeam()}
                          editBtnTitle="Редактировать"
                          editBtnDisabled={this.sqrSquareTeamStore.editTeamBtnDisabled}
                          onDeleteBtnClicked={() => this.sqrSquareTeamStore.deleteTeams()}
                          deleteBtnTitle="Удалить"
                          deleteBtnDisabled={this.sqrSquareTeamStore.deleteTeamBtnDisabled}
                />
            </DevsSplitterPanel>
            <DevsSplitterPanel>
                <div className="all_team">
                    {
                        this.sqrSquareTeamStore.mode === 'modify' ?
                            <div className="all_team__button_bar">
                                <DevsButton template="filled"
                                            color="success"
                                            icon="lni lni-plus"
                                            disabled={this.sqrSquareTeamStore.addUsersToSquareTeamBtnDisabled}
                                            onClick={async () => (await this.sqrSquareTeamStore.addUsersToSquareTeam())}
                                />
                                <DevsButton template="filled"
                                            color="danger"
                                            icon="lni lni-minus"
                                            disabled={this.sqrSquareTeamStore.removeUsersFromSquareTeamBtnDisabled}
                                            onClick={async () => (await this.sqrSquareTeamStore.removeUsersFromSquareTeam())}
                                />
                            </div> : undefined
                    }
                    <div className="all_team__grid">
                        <DevsGrid
                            title="Участники"
                            gridDefaultColDef={this.defaultColDef}
                            gridColDef={this.squareRoleUserColDef}
                            gridRowSelection="multiple"
                            onGridReady={async (event) => (await this.onSquareRoleUserGridReady(event))}
                            filters={this.sqrSquareTeamStore.squareTeamUserFilters}
                            fastFilterPlaceholder="Для поиска пользователя начните вводить ФИО"
                            onFilterConfirm={async (filters) => (await this.sqrSquareTeamStore.onSquareUserFilterConfirm(filters))}
                            onGridRowSelectionChanged={(event) => this.sqrSquareTeamStore.onSquareTeamUsersSelectionChange(event)}
                            additionalOperations={<>
                                <DevsButton template="filled"
                                            color="primary"
                                            title={this.sqrSquareTeamStore.mode === 'view' ? 'Редактировать' : 'Просмотр'}
                                            icon={this.sqrSquareTeamStore.mode === 'view' ? 'lni lni-pencil' : 'lni lni-eye'}
                                            disabled={this.sqrSquareTeamStore.modeBtnDisabled}
                                            onClick={async (event) => await this.sqrSquareTeamStore.toggleMode()}
                                />
                            </>}
                        />
                    </div>
                </div>
            </DevsSplitterPanel>
        </DevsSplitter>;
    }
}

const OSqrSquareTeam = observer(SqrSquareTeam);
export default OSqrSquareTeam;
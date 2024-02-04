import './AdmUserGroup.scss';
import React from "react";
import {observer} from "mobx-react";
import {StoreProps} from "../../../interfaces/StoreProps";
import AdmUserGroupStore from "./AdmUserGroup.store";
import DevsSplitterPanel from "@ajholl/devsuikit/dist/DevsSplitterPanel";
import DevsGrid from "../../../components/DevsGrid/DevsGrid";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import DevsSplitter from "@ajholl/devsuikit/dist/DevsSplitter";
import {ColDef, GridReadyEvent} from "ag-grid-community";
import {AdmGroupDto} from "../../../dtos/AdmGroup.dto";
import {AdmUserGroupDto} from "../../../dtos/AdmUserGroup.dto";

interface AdmUserGroupProps extends StoreProps {
}

export class AdmUserGroup extends React.Component<AdmUserGroupProps> {
    readonly admUserGroupStore: AdmUserGroupStore = this.props.rootStore.admUserGroupStore;

    defaultColDef: ColDef<AdmGroupDto> = {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: true,
    }

    userGroupColDef: ColDef<AdmUserGroupDto>[] = [
        {
            field: 'group.name',
            headerName: 'Системное имя',
        },
        {
            field: 'group.caption',
            headerName: 'Наименование',
        },
        {
            field: 'group.description',
            headerName: 'Описание',
        },
    ]
    groupColDef: ColDef<AdmGroupDto>[] = [
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

    async onUserGroupGridReady(event: GridReadyEvent<AdmUserGroupDto>): Promise<void> {
        this.admUserGroupStore.userGroupGridApi = event.api;
        event.api.setRowData([]);
    }

    async onGroupGridReady(event: GridReadyEvent<AdmGroupDto>): Promise<void> {
        this.admUserGroupStore.groupGridApi = event.api;
        event.api.setRowData([]);
    }

    render() {
        return <DevsSplitter layout="horizontal">
            <DevsSplitterPanel>
                <DevsGrid title="Группы пользователя"
                          gridDefaultColDef={this.defaultColDef}
                          gridColDef={this.userGroupColDef}
                          gridRowSelection="multiple"
                          onGridReady={async (event) => await this.onUserGroupGridReady(event)}
                          onGridRowSelectionChanged={(event) => this.admUserGroupStore.userGroupSelectionChange(event)}
                />
            </DevsSplitterPanel>
            <DevsSplitterPanel>
                <div className="all_group">
                    <div className="all_group__button_bar">
                        <DevsButton template="filled"
                                    color="primary"
                                    icon="lni lni-arrow-left"
                                    disabled={this.admUserGroupStore.addGroupToUserBtnDisabled}
                                    onClick={() => this.admUserGroupStore.addGroupToUser()}
                        />
                        <DevsButton template="filled"
                                    color="primary"
                                    icon="lni lni-arrow-right"
                                    disabled={this.admUserGroupStore.removeGroupFromUserBtnDisabled}
                                    onClick={() => this.admUserGroupStore.removeGroupFromUser()}
                        />
                    </div>
                    <div className="all_group__grid">
                        <DevsGrid title="Группы"
                                  gridDefaultColDef={this.defaultColDef}
                                  gridColDef={this.groupColDef}
                                  gridRowSelection="multiple"
                                  onGridReady={async (event) => await this.onGroupGridReady(event)}
                                  onGridRowSelectionChanged={(event) => this.admUserGroupStore.groupSelectionChange(event)}
                        />
                    </div>
                </div>
            </DevsSplitterPanel>
        </DevsSplitter>;
    }
}

const OAdmUserGroup = observer(AdmUserGroup);
export default OAdmUserGroup;
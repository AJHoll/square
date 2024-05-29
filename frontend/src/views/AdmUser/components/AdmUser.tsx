import './AdmUser.scss';
import React from "react";
import {StoreProps} from "../../../interfaces/StoreProps";
import {observer} from "mobx-react";
import AdmUserStore from "./AdmUser.store";
import DevsGrid from "../../../components/DevsGrid/DevsGrid";
import {ColDef, GridReadyEvent} from "ag-grid-community";
import {AdmUserDto} from "../../../dtos/AdmUser.dto";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";

interface AdmUserProps extends StoreProps {
}

export class AdmUser extends React.Component<AdmUserProps> {
    readonly admUserStore: AdmUserStore = this.props.rootStore.admUserStore;

    inputFileRef: React.RefObject<HTMLInputElement> = React.createRef();

    defaultColDef: ColDef<AdmUserDto> = {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: true,
    }

    colDef: ColDef<AdmUserDto>[] = [
        {
            field: 'name',
            headerName: 'Системное имя',
        },
        {
            field: 'caption',
            headerName: 'Наименование',
        },
    ]

    async onGridReady(event: GridReadyEvent<AdmUserDto>): Promise<void> {
        this.admUserStore.gridApi = event.api;
        this.admUserStore.columnApi = event.columnApi;
        await this.admUserStore.reloadUsers();
    }

    render() {
        return <DevsGrid gridColDef={this.colDef}
                         gridDefaultColDef={this.defaultColDef}
                         createBtnTitle="Создать"
                         editBtnTitle="Редактировать"
                         deleteBtnTitle="Удалить"
                         gridRowSelection="multiple"
                         editBtnDisabled={this.admUserStore.editBtnDisabled}
                         deleteBtnDisabled={this.admUserStore.deleteBtnDisabled}
                         onGridReady={async (event) => this.onGridReady(event)}
                         onGridRowSelectionChanged={async (event) => this.admUserStore.userSelectionChange(event)}
                         onCreateBtnClicked={() => this.admUserStore.createNewUser()}
                         onEditBtnClicked={() => this.admUserStore.editUser()}
                         onDeleteBtnClicked={() => this.admUserStore.deleteUsers()}
                         onGridRowDoubleClicked={() => !this.admUserStore.editBtnDisabled ? this.admUserStore.editUser() : undefined}
                         additionalOperations={<>
                             <DevsButton template={"filled"}
                                         color={"info"}
                                         style={{marginLeft: '20px'}}
                                         title="Скачать шаблон импорта"
                                         icon="lni lni-download"
                                         onClick={() => this.admUserStore.downloadImportTemplate()}
                             />
                             <DevsButton template={"filled"}
                                         color={"secondary"}
                                         title="Импортировать"
                                         icon="lni lni-download"
                                         onClick={() => this.inputFileRef.current?.click()}
                             />
                             <input hidden
                                    ref={this.inputFileRef}
                                    type="file"
                                    multiple={false}
                                    onChange={async (event) => await this.admUserStore.importUser(event)}/>
                         </>}
        />;
    }
}

const OAdmUser = observer(AdmUser);
export default OAdmUser;
import React from "react";
import {StoreProps} from "../../../interfaces/StoreProps";
import {observer} from "mobx-react";
import "./SqrSquareModule.scss";
import {SqrSquareModuleStore} from "./SqrSquareModule.store";
import DevsGrid from "../../../components/DevsGrid/DevsGrid";
import {ColDef, GridReadyEvent} from "ag-grid-community";
import {SqrSquareModuleDto} from "../../../dtos/SqrSquareModule.dto";
import OSqrSquareModuleCard from "./SqrSquareModuleCard";

interface SqrSquareModuleProps extends StoreProps {
}

export class SqrSquareModule extends React.Component<SqrSquareModuleProps> {
    sqrSquareModuleStore: SqrSquareModuleStore = this.props.rootStore.sqrSquareModuleStore;
    defaultColDef: ColDef = {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: true,
    }
    sqrSquareModuleColDef: ColDef<SqrSquareModuleDto>[] = [
        {
            field: 'id',
            headerName: 'ID',
            hide: true,
        },
        {
            field: 'code',
            headerName: 'Код',
        },
        {
            field: 'caption',
            headerName: 'Наименование',
        },
        {
            field: 'evaluating',
            headerName: 'Доступен сейчас для проверки',
        },
    ]

    async onSqrSquareModuleGridReady(event: GridReadyEvent<SqrSquareModuleDto>): Promise<void> {
        this.sqrSquareModuleStore.sqrSquareModuleGridApi = event.api;
        event.api.setRowData([]);
    }


    render() {
        return <>
            <OSqrSquareModuleCard rootStore={this.props.rootStore}/>
            <DevsGrid title="Модули"
                      gridDefaultColDef={this.defaultColDef}
                      gridColDef={this.sqrSquareModuleColDef}
                      gridRowSelection="single"
                      onGridReady={async (event) => (await this.onSqrSquareModuleGridReady(event))}
                      onGridRowSelectionChanged={(event) => this.sqrSquareModuleStore.onSqrSquareModulesSelectionChange(event)}
                      onCreateBtnClicked={() => this.sqrSquareModuleStore.createModule()}
                      createBtnTitle="Создать"
                      createBtnDisabled={this.sqrSquareModuleStore.createSquareModuleBtnDisabled}
                      onEditBtnClicked={() => this.sqrSquareModuleStore.editModule()}
                      editBtnTitle="Редактировать"
                      editBtnDisabled={this.sqrSquareModuleStore.editSquareModuleBtnDisabled}
                      onDeleteBtnClicked={() => this.sqrSquareModuleStore.deleteModule()}
                      deleteBtnTitle="Удалить"
                      deleteBtnDisabled={this.sqrSquareModuleStore.deleteSquareModulesBtnDisabled}
            />
        </>;
    }
}

const OSqrSquareModule = observer(SqrSquareModule);
export default OSqrSquareModule;
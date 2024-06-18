import {observer} from "mobx-react";
import React from "react";
import './SqrSquare.scss';
import {StoreProps} from "../../../interfaces/StoreProps";
import {ColDef, GridReadyEvent} from "ag-grid-community";
import SqrSquareStore from "./SqrSquare.store";
import {SqrSquareDto} from "../../../dtos/SqrSquare.dto";
import DevsGrid from "../../../components/DevsGrid/DevsGrid";

interface SqrSquareProps extends StoreProps {
}

export class SqrSquare extends React.Component<SqrSquareProps> {
    readonly sqrSquareStore: SqrSquareStore = this.props.rootStore.sqrSquareStore;

    defaultColDef: ColDef<SqrSquareDto> = {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: true,
    }
    colDef: ColDef<SqrSquareDto>[] = [
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
            field: 'activeModules',
            headerName: 'Проверяемые модули',
        },
    ]

    async onGridReady(event: GridReadyEvent<SqrSquareDto>): Promise<void> {
        this.sqrSquareStore.gridApi = event.api;
        this.sqrSquareStore.columnApi = event.columnApi;
        await this.sqrSquareStore.reloadSquares();
    }

    render() {
        return <DevsGrid gridColDef={this.colDef}
                         gridDefaultColDef={this.defaultColDef}
                         createBtnTitle="Создать"
                         editBtnTitle="Редактировать"
                         deleteBtnTitle="Удалить"
                         gridRowSelection="multiple"
                         createBtnDisabled={this.sqrSquareStore.createBtnDisabled}
                         editBtnDisabled={this.sqrSquareStore.editBtnDisabled}
                         deleteBtnDisabled={this.sqrSquareStore.deleteBtnDisabled}
                         onGridReady={(event) => this.onGridReady(event)}
                         onGridRowSelectionChanged={(event) => this.sqrSquareStore.squareSelectionChange(event)}
                         onCreateBtnClicked={() => this.sqrSquareStore.createNewSquare()}
                         onEditBtnClicked={() => this.sqrSquareStore.editSquare()}
                         onDeleteBtnClicked={() => this.sqrSquareStore.deleteSquares()}
                         onGridRowDoubleClicked={() => !this.sqrSquareStore.editBtnDisabled ? this.sqrSquareStore.editSquare() : undefined}
        />;
    }
}

const OSqrSquare = observer(SqrSquare);
export default OSqrSquare;
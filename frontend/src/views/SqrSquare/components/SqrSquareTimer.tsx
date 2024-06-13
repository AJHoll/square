import React from "react";
import {StoreProps} from "../../../interfaces/StoreProps";
import {observer} from "mobx-react";
import DevsGrid from "../../../components/DevsGrid/DevsGrid";
import {ColDef, GridReadyEvent} from "ag-grid-community";
import {SqrTimerDto} from "../../../dtos/SqrTimer.dto";
import SqrSquareTimerStore from "./SqrSquareTimer.store";
import "./SqrSquareTimer.scss";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import DevsModal from "@ajholl/devsuikit/dist/DevsModal";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";
import {devsGridDateTimeFormatter} from "../../../components/DevsGrid/DevsGridFunctions";
import DevsTextArea from "@ajholl/devsuikit/dist/DevsTextArea";

interface SqrSquareTimerProps extends StoreProps {
}

export class SqrSquareTimer extends React.Component<SqrSquareTimerProps> {
    sqrSquareTimerStore: SqrSquareTimerStore = this.props.rootStore.sqrSquareTimerStore;

    defaultColDef: ColDef = {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: true,
    }
    sqrTimerColDef: ColDef<SqrTimerDto & { action: unknown }>[] = [
        {
            field: 'id',
            headerName: 'ID',
            hide: true,
        },
        {
            field: 'caption',
            headerName: 'Наименование',
        },
        {
            field: 'count',
            headerName: 'Значение',
            filter: false,
            valueFormatter: (event) => {
                return [Math.floor(event.value / 3600), Math.floor((event.value % 3600) / 60), event.value % 60]
                    .map((val) => String(val).padStart(2, '0'))
                    .join(':');
            }
        },
        {
            field: 'countLeft',
            headerName: 'Осталось',
            filter: false,
            valueFormatter: (event) => {
                return [Math.floor(event.value / 3600), Math.floor((event.value % 3600) / 60), event.value % 60]
                    .map((val) => String(val).padStart(2, '0'))
                    .join(':');
            }
        },
        {
            field: 'state.value',
            headerName: 'Состояние',
        },
        {
            field: 'beginTime',
            headerName: 'Дата/Время запуска',
            valueFormatter: devsGridDateTimeFormatter
        },
        {
            field: 'pauseTime',
            headerName: 'Дата/Время паузы',
            valueFormatter: devsGridDateTimeFormatter
        },
        {
            field: 'continueTime',
            headerName: 'Дата/Время возобновления',
            valueFormatter: devsGridDateTimeFormatter
        },
        {
            field: 'stopTime',
            headerName: 'Дата/Время завершения',
            valueFormatter: devsGridDateTimeFormatter
        }
    ]

    async onSqrTimeerGridReady(event: GridReadyEvent<SqrTimerDto>): Promise<void> {
        this.sqrSquareTimerStore.sqrTimersGridApi = event.api;
        event.api.setRowData([{}]);
    }

    render() {
        return <>
            <DevsModal visible={this.sqrSquareTimerStore.timerCountCardVisible}
                       title={`Задайте время ${this.sqrSquareTimerStore.timerCountCardType === 'all' ? 'таймеров' : 'таймера'}`}
                       onClose={() => this.sqrSquareTimerStore.timerCountCardVisible = false}
                       style={{width: '400px', height: '160px'}}
                       footer={<DevsButton template="filled"
                                           color="success"
                                           icon="lni lni-save"
                                           title="Задать"
                                           onClick={() => this.sqrSquareTimerStore.setTimerCount()}
                       />}
            >
                <div className="sqr_timer_count_hms_line">
                    <DevsInput addonAfter={<>час.</>}
                               keyFilter="pint"
                               onChange={(event) => this.sqrSquareTimerStore.timerCardHoursCount = +event.target.value}
                    ></DevsInput>
                    <DevsInput addonAfter={<>мин.</>}
                               keyFilter="pint"
                               onChange={(event) => this.sqrSquareTimerStore.timerCardMinutesCount = +event.target.value}
                    ></DevsInput>
                    <DevsInput addonAfter={<>сек.</>}
                               keyFilter="pint"
                               onChange={(event) => this.sqrSquareTimerStore.timerCardSecondsCount = +event.target.value}
                    ></DevsInput>
                </div>
            </DevsModal>
            <DevsModal visible={this.sqrSquareTimerStore.timerDescriptionVisible}
                       title={`Задайте причину приостановки ${this.sqrSquareTimerStore.timerCountCardType === 'all' ? 'таймеров' : 'таймера'}`}
                       onClose={() => this.sqrSquareTimerStore.timerDescriptionVisible = false}
                       style={{width: '400px', height: '230px'}}
                       className="timer_description_dialog"
                       footer={<DevsButton template="filled"
                                           color="success"
                                           icon="lni lni-pause"
                                           title="Приостановить"
                                           onClick={() => this.sqrSquareTimerStore.pauseTimerWithDescription()}
                       />}
            >

                <DevsTextArea onChange={(event) => this.sqrSquareTimerStore.timerDescription = event.target.value}/>
            </DevsModal>
            <DevsGrid title="Таймеры"
                      gridDefaultColDef={this.defaultColDef}
                      gridColDef={this.sqrTimerColDef}
                      gridRowSelection="single"
                      onGridReady={async (event) => (await this.onSqrTimeerGridReady(event))}
                      onGridPreDestroyed={(event) => this.sqrSquareTimerStore.onTimerGridPreDestroyed()}
                      onCreateBtnClicked={() => this.sqrSquareTimerStore.startTimer()}
                      createBtnDisabled={!this.sqrSquareTimerStore.squareId}
                      createBtnTitle="Запустить все"
                      createBtnIcon="lni lni-play"
                      onEditBtnClicked={() => this.sqrSquareTimerStore.pauseTimer()}
                      editBtnDisabled={!this.sqrSquareTimerStore.squareId}
                      editBtnTitle="Приостановить все"
                      editBtnIcon="lni lni-pause"
                      onDeleteBtnClicked={() => this.sqrSquareTimerStore.stopTimer()}
                      deleteBtnDisabled={!this.sqrSquareTimerStore.squareId}
                      deleteBtnTitle="Остановить все"
                      deleteBtnIcon="lni lni-stop"
                      additionalOperations={<>
                          <DevsButton template="filled"
                                      color="primary"
                                      title="Задать значения всем"
                                      icon="lni lni-timer"
                                      onClick={() => this.sqrSquareTimerStore.setAllTimerCountBtnClicked()}
                                      disabled={!this.sqrSquareTimerStore.squareId}
                          />
                          <DevsButton template="filled"
                                      color="primary"
                                      icon="lni lni-reload"
                                      title="Пересоздать все"
                                      onClick={async () => await this.sqrSquareTimerStore.recreateTimer()}
                                      disabled={!this.sqrSquareTimerStore.squareId}
                          />
                          <DevsButton template="filled"
                                      color="info"
                                      icon="lni lni-download"
                                      title="Протокол"
                                      style={{marginLeft: '20px'}}
                                      disabled={!this.sqrSquareTimerStore.squareId}
                                      onClick={() => this.sqrSquareTimerStore.downloadPauseReport()}
                          />

                          <DevsButton template="filled"
                                      color="success"
                                      icon="lni lni-play"
                                      style={{marginLeft: '20px'}}
                                      onClick={() => this.sqrSquareTimerStore.startTimer(true)}
                                      disabled={(this.sqrSquareTimerStore.selectionSqrTimers ?? []).length === 0}
                          />
                          <DevsButton template="filled"
                                      color="secondary"
                                      icon="lni lni-pause"
                                      onClick={() => this.sqrSquareTimerStore.pauseTimer(true)}
                                      disabled={(this.sqrSquareTimerStore.selectionSqrTimers ?? []).length === 0}
                          />
                          <DevsButton template="filled"
                                      color="danger"
                                      icon="lni lni-stop"
                                      onClick={() => this.sqrSquareTimerStore.stopTimer(true)}
                                      disabled={(this.sqrSquareTimerStore.selectionSqrTimers ?? []).length === 0}
                          />
                          <DevsButton template="filled"
                                      color="primary"
                                      icon="lni lni-timer"
                                      onClick={() => this.sqrSquareTimerStore.setTimerCountBtnClicked()}
                                      disabled={(this.sqrSquareTimerStore.selectionSqrTimers ?? []).length === 0}
                          />
                          <DevsButton template="filled"
                                      color="primary"
                                      icon="lni lni-reload"
                                      onClick={async () => await this.sqrSquareTimerStore.recreateTimer(true)}
                                      disabled={(this.sqrSquareTimerStore.selectionSqrTimers ?? []).length === 0}
                          />
                      </>}
                      onFastFilterBtnClicked={() => null}
                      filters={this.sqrSquareTimerStore.squareTimerFilters}
                      onGridRowSelectionChanged={(event) => this.sqrSquareTimerStore.onTimerSelectionChange(event)}
            />
        </>
    }
}

const OSqrSquareTimer = observer(SqrSquareTimer);
export default OSqrSquareTimer;
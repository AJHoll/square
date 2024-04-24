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
        },
        {
            field: 'pauseTime',
            headerName: 'Дата/Время паузы',
        },
        {
            field: 'continueTime',
            headerName: 'Дата/Время возобновления',
        },
        {
            field: 'stopTime',
            headerName: 'Дата/Время останова',
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
            <DevsGrid title="Таймеры"
                      gridDefaultColDef={this.defaultColDef}
                      gridColDef={this.sqrTimerColDef}
                      gridRowSelection="single"
                      onGridReady={async (event) => (await this.onSqrTimeerGridReady(event))}
                      onCreateBtnClicked={() => null}
                      createBtnTitle="Запустить все"
                      createBtnIcon="lni lni-play"
                      onEditBtnClicked={() => null}
                      editBtnTitle="Приостановить все"
                      editBtnIcon="lni lni-pause"
                      onDeleteBtnClicked={() => null}
                      deleteBtnTitle="Остановить все"
                      deleteBtnIcon="lni lni-stop"
                      additionalOperations={<>
                          <DevsButton template="filled"
                                      color="primary"
                                      title="Задать значения всем"
                                      icon="lni lni-timer"
                                      onClick={() => this.sqrSquareTimerStore.setAllTimerCountBtnClicked()}
                          />
                          <DevsButton template="filled"
                                      color="primary"
                                      icon="lni lni-reload"
                                      title="Пересоздать"
                                      style={{marginLeft: '20px'}}
                                      onClick={async () => await this.sqrSquareTimerStore.recreateTimers()}
                          />

                          <DevsButton template="filled"
                                      color="success"
                                      icon="lni lni-play"
                                      style={{marginLeft: '20px'}}
                          />
                          <DevsButton template="filled"
                                      color="secondary"
                                      icon="lni lni-pause"
                          />
                          <DevsButton template="filled"
                                      color="danger"
                                      icon="lni lni-stop"
                          />
                          <DevsButton template="filled"
                                      color="primary"
                                      icon="lni lni-timer"
                                      onClick={() => this.sqrSquareTimerStore.setTimerCountBtnClicked()}
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
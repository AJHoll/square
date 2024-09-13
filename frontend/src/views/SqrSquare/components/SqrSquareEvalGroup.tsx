import './SqrSquareEvalGroup.scss';
import {StoreProps} from "../../../interfaces/StoreProps";
import React from "react";
import {observer} from "mobx-react";
import SqrSquareEvalGroupStore from "./SqrSquareEvalGroup.store";
import DevsSplitter from "@ajholl/devsuikit/dist/DevsSplitter";
import DevsGrid from "../../../components/DevsGrid/DevsGrid";
import DevsSplitterPanel from "@ajholl/devsuikit/dist/DevsSplitterPanel";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import {ColDef, GridReadyEvent, ICellRendererParams} from "ag-grid-community";
import {SqrSquareEvalGroupDto} from "../../../dtos/SqrSquareEvalGroup.dto";
import {SqrSquareEvalGroupUserDto} from "../../../dtos/SqrSquareEvalGroupUser.dto";
import OSqrSquareEvalGroupCard from "./SqrSquareEvalGroupCard";
import DevsCard from "../../../components/DevsCard/DevsCard";
import {ColorPicker} from "primereact/colorpicker";
import DevsForm from "@ajholl/devsuikit/dist/DevsForm";
import DevsFormItem from "@ajholl/devsuikit/dist/DevsFormItem";

interface SqrSquareEvalGroupProps extends StoreProps {
}

export class SqrSquareEvalGroup extends React.Component<SqrSquareEvalGroupProps> {
    readonly sqrSquareEvalGroupStore: SqrSquareEvalGroupStore = this.props.rootStore.sqrSquareEvalGroupStore;

    defaultColDef: ColDef = {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: true,
    }
    sqrTeamColDef: ColDef<SqrSquareEvalGroupDto>[] = [
        {
            field: 'id',
            headerName: 'ID',
            hide: true,
        },
        {
            field: 'code',
            headerName: 'Системное имя',
            flex: 2
        },
        {
            field: 'caption',
            headerName: 'Наименование',
            flex: 6
        },
        {
            field: 'modules',
            headerName: 'Модули',
            flex: 2
        },
    ]

    squareRoleUserColDef: ColDef<SqrSquareEvalGroupUserDto>[] = [
        {
            field: 'name',
            headerName: 'Системное имя',
        },
        {
            field: 'caption',
            headerName: 'Наименование',
        },
        {
            field: 'role.caption',
            headerName: 'Роль',
        },
        {
            field: "activeInSquareRole",
            headerName: 'Используется'
        },
        {
            field: "color",
            headerName: 'Цвет',
            cellRenderer: (params: ICellRendererParams) => <div style={{
                width: '34px',
                height: '34px',
                backgroundColor: `#${params.value}`,
                margin: 'auto',
                alignSelf: 'center'
            }}/>
        }
    ]

    async onSqrTeamGridReady(event: GridReadyEvent<SqrSquareEvalGroupDto>): Promise<void> {
        this.sqrSquareEvalGroupStore.squareEvalGroupGridApi = event.api;
        event.api.setRowData([]);
    }

    async onSquareRoleUserGridReady(event: GridReadyEvent<SqrSquareEvalGroupUserDto>): Promise<void> {
        this.sqrSquareEvalGroupStore.squareEvalGroupUserGridApi = event.api;
        event.api.setRowData([]);
    }

    render() {
        return <DevsSplitter layout="horizontal">
            <DevsSplitterPanel>
                <OSqrSquareEvalGroupCard rootStore={this.props.rootStore}/>
                <DevsGrid title="Группы проверки"
                          gridDefaultColDef={this.defaultColDef}
                          gridColDef={this.sqrTeamColDef}
                          gridRowSelection="single"
                          onGridReady={async (event) => (await this.onSqrTeamGridReady(event))}
                          onGridRowSelectionChanged={(event) => this.sqrSquareEvalGroupStore.onSquareEvalGroupSelectionChange(event)}
                          onCreateBtnClicked={() => this.sqrSquareEvalGroupStore.createEvalGroup()}
                          createBtnTitle="Создать"
                          createBtnDisabled={this.sqrSquareEvalGroupStore.createEvalGroupBtnDisabled}
                          onEditBtnClicked={() => this.sqrSquareEvalGroupStore.editEvalGroup()}
                          editBtnTitle="Редактировать"
                          editBtnDisabled={this.sqrSquareEvalGroupStore.editEvalGroupBtnDisabled}
                          onDeleteBtnClicked={() => this.sqrSquareEvalGroupStore.deleteEvalGroups()}
                          deleteBtnTitle="Удалить"
                          deleteBtnDisabled={this.sqrSquareEvalGroupStore.deleteEvalGroupsBtnDisabled}
                />
            </DevsSplitterPanel>
            <DevsSplitterPanel>
                <div className="all_eval_group">
                    {
                        this.sqrSquareEvalGroupStore.mode === 'modify' ?
                            <div className="all_eval_group__button_bar">
                                <DevsButton template="filled"
                                            color="success"
                                            icon="lni lni-plus"
                                            disabled={this.sqrSquareEvalGroupStore.addUsersToEvalGroupBtnDisabled}
                                            onClick={async () => (await this.sqrSquareEvalGroupStore.addUsersToEvalGroup())}
                                />
                                <DevsButton template="filled"
                                            color="danger"
                                            icon="lni lni-minus"
                                            disabled={this.sqrSquareEvalGroupStore.removeUsersFromEvalGroupBtnDisabled}
                                            onClick={async () => (await this.sqrSquareEvalGroupStore.removeUsersFromEvalGroup())}
                                />
                            </div> : undefined
                    }
                    <div className="all_eval_group__grid">
                        <DevsGrid title="Эксперты"
                                  gridDefaultColDef={this.defaultColDef}
                                  gridColDef={this.squareRoleUserColDef}
                                  gridRowSelection="multiple"
                                  onGridReady={async (event) => (await this.onSquareRoleUserGridReady(event))}
                                  filters={this.sqrSquareEvalGroupStore.squareEvalGroupUserFilters}
                                  fastFilterPlaceholder="Для поиска пользователя начните вводить ФИО"
                                  onFilterConfirm={async (filters) => (await this.sqrSquareEvalGroupStore.onEvalGroupUserFilterConfirm(filters))}
                                  onGridRowSelectionChanged={(event) => this.sqrSquareEvalGroupStore.onEvalGroupUsersSelectionChange(event)}
                                  additionalOperations={<>
                                      <DevsButton template="filled"
                                                  color="primary"
                                                  title={this.sqrSquareEvalGroupStore.mode === 'view' ? 'Редактировать' : 'Просмотр'}
                                                  icon={this.sqrSquareEvalGroupStore.mode === 'view' ? 'lni lni-pencil' : 'lni lni-eye'}
                                                  disabled={this.sqrSquareEvalGroupStore.modeBtnDisabled}
                                                  onClick={async (event) => await this.sqrSquareEvalGroupStore.toggleMode()}
                                      />
                                      <DevsButton template="filled"
                                                  color="secondary"
                                                  title="Цвет"
                                                  icon="lni lni-brush"
                                                  disabled={this.sqrSquareEvalGroupStore.colorBtnDisabled}
                                                  onClick={(event) => this.sqrSquareEvalGroupStore.openSetEvalGroupUserColorCard()}
                                      />
                                      <DevsCard visible={this.sqrSquareEvalGroupStore.setEvalGroupUserColorCardVisible}
                                                title="Выберите цвет"
                                                onCancelBtnClicked={() => this.sqrSquareEvalGroupStore.closeSetEvalGroupUserColorCard()}
                                                onCloseBtnClicked={() => this.sqrSquareEvalGroupStore.closeSetEvalGroupUserColorCard()}
                                                onSaveBtnClicked={async () => await this.sqrSquareEvalGroupStore.setEvalGroupUserColor()}
                                                cardItemWasChanged={this.sqrSquareEvalGroupStore.evalGroupUserColor !== '000'}
                                      >
                                          <DevsForm labelflex={2} inputflex={5}>
                                              <DevsFormItem label="Цвет">
                                                  <ColorPicker value={this.sqrSquareEvalGroupStore.evalGroupUserColor}
                                                               onChange={(event) => {
                                                                   this.sqrSquareEvalGroupStore.evalGroupUserColor = event.value as string;
                                                               }}
                                                               inputStyle={{width: '100%'}}
                                                               style={{width: '100%'}}
                                                  />
                                              </DevsFormItem>
                                          </DevsForm>
                                      </DevsCard>
                                  </>}
                        />
                    </div>
                </div>
            </DevsSplitterPanel>
        </DevsSplitter>;
    }
}

const OSqrSquareEvalGroup = observer(SqrSquareEvalGroup);
export default OSqrSquareEvalGroup;
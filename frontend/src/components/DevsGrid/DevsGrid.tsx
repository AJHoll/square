import './DevsGrid.scss';
import React from 'react';
import {ColDef, GridReadyEvent, SelectionChangedEvent} from 'ag-grid-community';
import DevsGridFilter from './DevsGridFilter';
import {UFilterItem} from './DevsGridFilterItem';
import DevsButton from '@ajholl/devsuikit/dist/DevsButton';
import DevsModal from '@ajholl/devsuikit/dist/DevsModal';
import DevsInput from '@ajholl/devsuikit/dist/DevsInput';
import {AgGridReact} from 'ag-grid-react';

interface UniversalListProps<GData = any> {
    // title props
    title?: string;
    // createBtn props
    createBtnDisabled?: boolean;
    createBtnTitle?: string;
    createBtnIcon?: string;
    onCreateBtnClicked?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    // editBtn props
    editBtnDisabled?: boolean;
    editBtnTitle?: string;
    editBtnIcon?: string;
    onEditBtnClicked?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    // deleteBtn props
    deleteBtnDisabled?: boolean;
    deleteBtnTitle?: string;
    deleteBtnIcon?: string;
    onDeleteBtnClicked?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    // reload props
    reloadBtnTitle?: string;
    reloadBtnIcon?: string;
    onReloadBtnClicked?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    // filter props
    filterBtnDisabled?: boolean;
    filterBtnTitle?: string;
    filterBtnIcon?: string;
    onFilterBtnClicked?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    filters?: { [key: string]: UFilterItem };
    onFilterConfirm?: (filters: { [key: string]: UFilterItem }) => void;
    // fast filter props
    fastFilterDisabled?: boolean;
    fastFilterPlaceholder?: string;
    fastFilterIcon?: string;
    onFastFilterBtnClicked?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    // grid props
    gridDefaultColDef?: ColDef<GData>;
    gridColDef?: ColDef<GData>[];
    gridRowSelection?: 'single' | 'multiple';
    onGridReady?: (params: GridReadyEvent<GData>) => void;
    onGridRowSelectionChanged?: (event: SelectionChangedEvent<GData>) => void;
    onGridRowDoubleClicked?: () => void;
}

interface UniversalListState {
    filterVisible: boolean;
    fastFilterValue: string;
}

export default class DevsGrid extends React.Component<UniversalListProps, UniversalListState> {
    constructor(props: UniversalListProps) {
        super(props);
        this.state = {
            filterVisible: false,
            fastFilterValue: '',
        };
    }

    render() {
        const {filterVisible, fastFilterValue} = this.state;
        const {title, createBtnDisabled, createBtnTitle, createBtnIcon, onCreateBtnClicked} = this.props;
        const {editBtnDisabled, editBtnTitle, editBtnIcon, onEditBtnClicked} = this.props;
        const {deleteBtnDisabled, deleteBtnTitle, deleteBtnIcon, onDeleteBtnClicked} = this.props;
        const {reloadBtnTitle, reloadBtnIcon, onReloadBtnClicked} = this.props;
        const {
            filterBtnDisabled,
            filterBtnTitle,
            filterBtnIcon,
            onFilterBtnClicked,
            filters,
            onFilterConfirm,
            onFastFilterBtnClicked,
        } = this.props;
        const {
            fastFilterPlaceholder,
            fastFilterDisabled,
            fastFilterIcon,
        } = this.props;
        const {
            gridDefaultColDef,
            gridColDef,
            onGridReady,
            gridRowSelection,
            onGridRowSelectionChanged,
            onGridRowDoubleClicked,
        } = this.props;
        return (
            <div className="app_universal_list">
                <div className="app_universal_list__toolbar">
                    {title ? <div className="app_universal_list__toolbar-title">
                        {title}
                    </div> : undefined}
                    {onCreateBtnClicked !== undefined || onEditBtnClicked !== undefined || onDeleteBtnClicked || undefined ?
                        <div className="app_universal_list__toolbar-operations">
                            {
                                onCreateBtnClicked !== undefined ? (
                                    <DevsButton template="filled"
                                                color="success"
                                                disabled={createBtnDisabled ?? false}
                                                title={createBtnTitle}
                                                icon={createBtnIcon ?? 'lni lni-add-files'}
                                                onClick={(event) => {
                                                    onCreateBtnClicked(event);
                                                }}
                                    />
                                ) : ''
                            }
                            {
                                onEditBtnClicked !== undefined ? (
                                    <DevsButton template="filled"
                                                color="secondary"
                                                disabled={editBtnDisabled ?? false}
                                                title={editBtnTitle}
                                                icon={editBtnIcon ?? 'lni lni-pencil-alt'}
                                                onClick={(event) => {
                                                    onEditBtnClicked(event);
                                                }}
                                    />
                                ) : ''
                            }
                            {
                                onDeleteBtnClicked !== undefined ? (
                                    <DevsButton template="filled"
                                                color="danger"
                                                disabled={deleteBtnDisabled ?? false}
                                                title={deleteBtnTitle}
                                                icon={deleteBtnIcon ?? 'lni lni-trash-can'}
                                                onClick={(event) => {
                                                    onDeleteBtnClicked(event);
                                                }}
                                    />
                                ) : ''
                            }
                        </div> : undefined
                    }
                    {
                        onReloadBtnClicked !== undefined || Object.keys(filters ?? {}).filter((f) => (f !== 'fast_filter')).length > 0 ?
                            <div className="app_universal_list__toolbar-actions">
                                {
                                    onReloadBtnClicked !== undefined ? (
                                        <DevsButton template="filled"
                                                    color="primary"
                                                    title={reloadBtnTitle}
                                                    icon={reloadBtnIcon ?? 'lni lni-spinner-arrow'}
                                                    onClick={(event) => {
                                                        onReloadBtnClicked(event);
                                                    }}
                                        />
                                    ) : ''
                                }
                                {
                                    Object.keys(filters ?? {}).filter((f) => (f !== 'fast_filter')).length > 0 ? (
                                        <DevsButton template="filled"
                                                    color="primary"
                                                    disabled={filterBtnDisabled ?? false}
                                                    title={filterBtnTitle}
                                                    icon={filterBtnIcon ?? 'lni lni-funnel'}
                                                    onClick={(event) => {
                                                        this.setState({filterVisible: true}, () => {
                                                            if (onFilterBtnClicked !== undefined) {
                                                                onFilterBtnClicked(event);
                                                            }
                                                        });
                                                    }}
                                        />
                                    ) : ''
                                }
                                {
                                    filters !== undefined ? (
                                        <DevsModal visible={filterVisible ?? false}
                                                   title="Фильтр"
                                                   style={{minWidth: '450px', minHeight: '250px'}}
                                                   onClose={() => {
                                                       this.setState({filterVisible: false});
                                                   }}
                                        >
                                            <DevsGridFilter defaultFilterValue={filters ?? {}}
                                                            onConfirm={(modifiedFilters) => {
                                                                this.setState({filterVisible: false}, () => {
                                                                    if (onFilterConfirm !== undefined) {
                                                                        onFilterConfirm(modifiedFilters);
                                                                    }
                                                                });
                                                            }}
                                            />
                                        </DevsModal>
                                    ) : ''
                                }
                            </div> : undefined
                    }
                    <div className="app_universal_list__toolbar-fast_filter">
                        {
                            filters?.fast_filter !== undefined ? (
                                <DevsInput className="app_universal_list__toolbar-fast_filter_input"
                                           disabled={fastFilterDisabled ?? false}
                                           placeholder={fastFilterPlaceholder ?? 'Для поиска, просто начните вводить искомое значение'}
                                           onChange={(event) => {
                                               this.setState({fastFilterValue: event.target.value});
                                           }}
                                           onKeyUp={(event) => {
                                               if (event.key === 'Enter') {
                                                   if (onFilterConfirm !== undefined) {
                                                       onFilterConfirm({
                                                           ...filters,
                                                           fast_filter: {
                                                               ...filters.fast_filter,
                                                               value: fastFilterValue
                                                           },
                                                       });
                                                   }
                                               }
                                           }}
                                           addonAfter={(
                                               <DevsButton template="outlined"
                                                           className="app_universal_list__toolbar-fast_filter_search_button"
                                                           color="secondary"
                                                           icon={fastFilterIcon ?? 'lni lni-search-alt'}
                                                           onClick={(event) => {
                                                               if (onFilterConfirm !== undefined) {
                                                                   onFilterConfirm({
                                                                       ...filters,
                                                                       fast_filter: {
                                                                           ...filters.fast_filter,
                                                                           value: fastFilterValue
                                                                       },
                                                                   });
                                                               }
                                                               if (onFastFilterBtnClicked !== undefined) {
                                                                   onFastFilterBtnClicked(event);
                                                               }
                                                           }}
                                               />
                                           )}
                                />
                            ) : ''
                        }
                    </div>
                </div>
                <div className="ag-theme-devs app_universal_list__grid">
                    <AgGridReact containerStyle={{width: '100%', height: '100%'}}
                                 defaultColDef={gridDefaultColDef}
                                 columnDefs={gridColDef}
                                 onGridReady={onGridReady}
                                 rowSelection={gridRowSelection ?? 'single'}
                                 onSelectionChanged={onGridRowSelectionChanged}
                                 onRowDoubleClicked={onGridRowDoubleClicked}/>
                </div>
            </div>
        )
            ;
    }
}

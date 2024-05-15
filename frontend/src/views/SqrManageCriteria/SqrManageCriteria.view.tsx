import './SqrManageCriteria.view.scss';
import React from "react";
import {BaseViewProps} from "../../interfaces/BaseViewProps";
import {observer} from "mobx-react";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import {SqrManageCriteriaStore} from "./SqrManageCriteria.store";
import DevsSelect from "@ajholl/devsuikit/dist/DevsSelect";
import OSqrManageCriteria from "./components/SqrManageCriteria";

export interface SqrManageCriteriaViewProps extends BaseViewProps {
}

export class SqrManageCriteriaView extends React.Component<SqrManageCriteriaViewProps> {
    sqrManageCriteriaStore: SqrManageCriteriaStore = this.props.rootStore.sqrManageCriteriaStore;
    selectRef: React.RefObject<DevsSelect> = React.createRef();

    async componentDidMount(): Promise<void> {
        document.title = this.props.title;
        await this.sqrManageCriteriaStore.init(this.selectRef);
    }

    render() {
        return <div className="sqr_manage_criteria_view">
            <div className="sqr_manage_criteria_view__toolbar">
                <DevsSelect ref={this.selectRef}
                            addonBefore={<span style={{paddingLeft: '10px', paddingRight: '10px'}}>Площадка</span>}
                            options={this.sqrManageCriteriaStore.squares}
                            value={this.sqrManageCriteriaStore.selectedSquare}
                            onlySelection={true}
                            onChange={(event) => this.sqrManageCriteriaStore.selectedSquare = event.value}
                />
                <DevsButton template="filled"
                            color="primary"
                            title="Критерий"
                            icon="lni lni-plus"
                            onClick={() => this.sqrManageCriteriaStore.addCriteria()}
                />
                <DevsButton template="filled"
                            color="success"
                            title="Сохранить"
                            icon="lni lni-save"
                            onClick={() => this.sqrManageCriteriaStore.saveCriterias()}
                />

                <DevsButton template="filled"
                            color="danger"
                            title="Очистить"
                            icon="lni lni-check-box"
                            style={{margin: '0 25px'}}
                            onClick={() => this.sqrManageCriteriaStore.clearCriterias()}
                />
                <DevsButton template="filled"
                            color="info"
                            title="из XLSX"
                            icon="lni lni-download"
                            onClick={() => this.sqrManageCriteriaStore.uploadFromXLSX()}
                />
                <DevsButton template="filled"
                            color="secondary"
                            title="в XLSX"
                            icon="lni lni-upload"
                            onClick={() => this.sqrManageCriteriaStore.downloadXLSX()}
                />
            </div>
            <div className="sqr_manage_criteria_view__content">
                {this.sqrManageCriteriaStore.criterias.map((criteria) => (
                    <OSqrManageCriteria rootStore={this.props.rootStore}
                                        key={criteria.id}
                                        criteria={criteria}
                    />))}
            </div>
        </div>
    }
}

const OSqrManageCriteriaView = observer(SqrManageCriteriaView);
export default OSqrManageCriteriaView;
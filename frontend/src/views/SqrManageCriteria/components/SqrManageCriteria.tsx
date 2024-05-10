import './SqrManageCriteria.scss';
import {StoreProps} from "../../../interfaces/StoreProps";
import React from "react";
import {observer} from "mobx-react";
import {SqrCriteriaDto} from "../../../dtos/SqrCriteria.dto";
import DevsPanel from "@ajholl/devsuikit/dist/DevsPanel";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import {SqrManageCriteriaStore} from "../SqrManageCriteria.store";
import OSqrManageSubcriteria from "./SqrManageSubcriteria";

interface SqrManageCriteriaProps extends StoreProps {
    criteria: SqrCriteriaDto
}

export class SqrManageCriteria extends React.Component<SqrManageCriteriaProps> {
    sqrManageCriteriaStore: SqrManageCriteriaStore = this.props.rootStore.sqrManageCriteriaStore;

    render() {
        const {criteria} = this.props;
        return <DevsPanel className="sqr_manage_criteria">
            <div className="sqr_manage_criteria__title">
                <label className="sqr_manage_criteria__key">
                    Ключ
                    <DevsInput keyFilter="alpha"
                               value={criteria.key}
                               onChange={(event) => this.sqrManageCriteriaStore.setCriteriaKey(criteria.id, event.target.value)}
                    />
                </label>
                <label className="sqr_manage_criteria__caption">
                    Название критерия
                    <DevsInput value={criteria.caption}
                               onChange={(event) => this.sqrManageCriteriaStore.setCriteriaCaption(criteria.id, event.target.value)}
                    />
                </label>
                <label className="sqr_manage_criteria_mark">
                    Вес критерия
                    <DevsInput keyFilter="num"
                               value={criteria.mark}
                               onChange={(event) => this.sqrManageCriteriaStore.setCriteriaMark(criteria.id, event.target.value)}
                    />
                </label>
                <DevsButton template="outlined"
                            color="primary"
                            className="sqr_manage_criteria__create"
                            icon="lni lni-plus"
                            title="Субкритерий"
                            onClick={(event) => this.sqrManageCriteriaStore.addSubcriteria(criteria.id)}
                />
                <DevsButton template="outlined"
                            color="danger"
                            className="sqr_manage_criteria__delete"
                            icon="lni lni-trash-can"
                            onClick={(event) => this.sqrManageCriteriaStore.removeCriteria(criteria.id)}
                />
            </div>
            <div className="sqr_manage_criteria__content">
                {criteria.subcriterias.map((subcriteria) => (
                    <OSqrManageSubcriteria rootStore={this.props.rootStore}
                                           key={subcriteria.id}
                                           criteria={criteria}
                                           subcriteria={subcriteria}
                    />
                ))}
            </div>
        </DevsPanel>
    }
}

const OSqrManageCriteria = observer(SqrManageCriteria);
export default OSqrManageCriteria;
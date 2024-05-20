import './SqrManageRateCriteria.scss';
import React from "react";
import {StoreProps} from "../../../interfaces/StoreProps";
import {observer} from "mobx-react";
import {SqrCriteriaDto} from "../../../dtos/SqrCriteria.dto";
import DevsPanel from "@ajholl/devsuikit/dist/DevsPanel";
import SqrManageRateStore from "../SqrManageRate.store";
import OSqrManageRateSubcriteria from "./SqrManageRateSubcriteria";

interface SqrManageRateCriteriaProps extends StoreProps {
    criteria: SqrCriteriaDto
}

export class SqrManageRateCriteria extends React.Component<SqrManageRateCriteriaProps> {
    sqrManageRateStore: SqrManageRateStore = this.props.rootStore.sqrManageRateStore;

    render() {
        const {criteria} = this.props;
        return <DevsPanel className="sqr_manage_rate_criteria">
            <div className="sqr_manage_rate_criteria__title">
                <div className="sqr_manage_rate_criteria__key">{criteria.key}</div>
                <div className="sqr_manage_rate_criteria__caption">{criteria.caption}</div>
            </div>
            <div className="sqr_manage_rate_criteria__content">
                {criteria.subcriterias.map((subcriteria) => (
                    <OSqrManageRateSubcriteria rootStore={this.props.rootStore}
                                               key={subcriteria.id}
                                               criteria={criteria}
                                               subcriteria={subcriteria}
                    />
                ))}
            </div>
        </DevsPanel>
    }
}

const OSqrManageRateCriteria = observer(SqrManageRateCriteria);
export default OSqrManageRateCriteria;
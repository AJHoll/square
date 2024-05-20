import './SqrManageRateSubcriteria.scss';
import {StoreProps} from "../../../interfaces/StoreProps";
import {SqrCriteriaDto} from "../../../dtos/SqrCriteria.dto";
import React from "react";
import SqrManageRateStore from "../SqrManageRate.store";
import {observer} from "mobx-react";
import {SqrSubcriteriaDto} from "../../../dtos/SqrSubcriteria.dto";
import DevsPanel from "@ajholl/devsuikit/dist/DevsPanel";
import OSqrManageRateAspect from "./SqrManageRateAspect";

interface SqrManageRateSubcriteriaProps extends StoreProps {
    criteria: SqrCriteriaDto,
    subcriteria: SqrSubcriteriaDto,
}

export class SqrManageRateSubcriteria extends React.Component<SqrManageRateSubcriteriaProps> {
    sqrManageRateStore: SqrManageRateStore = this.props.rootStore.sqrManageRateStore;

    render() {
        const {criteria, subcriteria} = this.props;
        return <DevsPanel className="sqr_manage_rate_subcriteria">
            <div className="sqr_manage_rate_subcriteria__key">
                {`${criteria.key}${subcriteria.order}`}
            </div>
            <div className="sqr_manage_rate_subcriteria__right">
                <div className="sqr_manage_rate_subcriteria__title">
                    {subcriteria.caption}
                </div>
                <div className="sqr_manage_rate_subcriteria__content">
                    {
                        subcriteria.aspects.map((aspect) => (
                            <OSqrManageRateAspect key={aspect.id}
                                                  rootStore={this.props.rootStore}
                                                  criteria={criteria}
                                                  subcriteria={subcriteria}
                                                  aspect={aspect}
                            />
                        ))
                    }
                </div>
            </div>
        </DevsPanel>
    }
}

const OSqrManageRateSubcriteria = observer(SqrManageRateSubcriteria);
export default OSqrManageRateSubcriteria;
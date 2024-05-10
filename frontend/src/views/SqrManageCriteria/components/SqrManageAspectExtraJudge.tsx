import './SqrManageAspectExtraJudge.scss';
import React from "react";
import {SqrManageAspectExtraProps} from "./SqrManageAspectExtra";
import {SqrManageCriteriaStore} from "../SqrManageCriteria.store";
import {observer} from "mobx-react";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";

export interface SqrManageAspectExtraJudgeProps extends SqrManageAspectExtraProps {
}

export class SqrManageAspectExtraJudge extends React.Component<SqrManageAspectExtraJudgeProps> {
    sqrManageCriteriaStore: SqrManageCriteriaStore = this.props.rootStore.sqrManageCriteriaStore;

    render() {
        const {criteria, subcriteria, aspect} = this.props;
        return (
            <div className="sqr_manage_aspect_extra">
                {
                    this.props.aspect.extra?.map((extra) => (
                        <div className="sqr_manage_aspect_extra_item"
                             key={extra.id}
                        >
                            <label className="sqr_manage_aspect_extra_item__description">
                                <DevsInput value={extra.description}
                                           addonBefore={<span
                                               className="sqr_manage_aspect_extra_item__score">{extra.mark}</span>}
                                           onChange={(event) =>
                                               this.sqrManageCriteriaStore.setAspectExtraDescription(criteria.id, subcriteria.id, aspect.id, extra.id, event.target.value)}
                                />
                            </label>
                        </div>
                    ))
                }
            </div>
        );
    }
}

const OSqrManageAspectExtraJudge = observer(SqrManageAspectExtraJudge);
export default OSqrManageAspectExtraJudge;
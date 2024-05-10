import './SqrManageAspectExtraDiscrete.scss';
import React from "react";
import {SqrManageAspectExtraProps} from "./SqrManageAspectExtra";
import {SqrManageCriteriaStore} from "../SqrManageCriteria.store";
import {observer} from "mobx-react";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";

export interface SqrManageAspectExtraDiscreteProps extends SqrManageAspectExtraProps {
}

export class SqrManageAspectExtraDiscrete extends React.Component<SqrManageAspectExtraDiscreteProps> {
    sqrManageCriteriaStore: SqrManageCriteriaStore = this.props.rootStore.sqrManageCriteriaStore;

    render() {
        const {criteria, subcriteria, aspect} = this.props;
        return <div className="sqr_manage_aspect_extra">
            <div className="sqr_manage_aspect_extra__toolbar">
                <DevsButton template="outlined"
                            color="primary"
                            className="sqr_manage_aspect_extra__toolbar-create"
                            icon="lni lni-plus"
                            title="Тип ошибки"
                            onClick={() => this.sqrManageCriteriaStore.addAspextExtraDiscrete(criteria.id, subcriteria.id, aspect.id)}
                />
            </div>
            <div className="sqr_manage_aspect_extra__content">
                {
                    this.props.aspect.extra?.map((extra) => (
                        <div className="sqr_manage_aspect_extra_item"
                             key={extra.id}
                        >
                            <label className="sqr_manage_aspect_extra_item__description">
                                Описание
                                <DevsInput value={extra.description}
                                           onChange={(event) =>
                                               this.sqrManageCriteriaStore.setAspectExtraDescription(criteria.id, subcriteria.id, aspect.id, extra.id, event.target.value)}
                                />
                            </label>
                            <label className="sqr_manage_aspect_extra_item__mark">
                                Вес ошибки
                                <DevsInput value={extra.mark}
                                           onChange={(event) =>
                                               this.sqrManageCriteriaStore.setAspectExtraMark(criteria.id, subcriteria.id, aspect.id, extra.id, event.target.value)}
                                />
                            </label>
                            <DevsButton template="outlined"
                                        color="danger"
                                        className="sqr_manage_aspect_extra_item__delete"
                                        icon="lni lni-trash-can"
                                        onClick={() => this.sqrManageCriteriaStore.removeAspectExtra(criteria.id, subcriteria.id, aspect.id, extra.id)}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    }
}

const OSqrManageAspectExtraDiscrete = observer(SqrManageAspectExtraDiscrete);
export default OSqrManageAspectExtraDiscrete;
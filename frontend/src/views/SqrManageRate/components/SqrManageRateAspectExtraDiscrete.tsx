import './SqrManageRateAspectExtraDiscrete.scss';
import React from "react";
import {observer} from "mobx-react";
import {SqrManageRateAspectExtraProps} from "./SqrManageRateAspectExtra";
import SqrManageRateStore from "../SqrManageRate.store";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";

export interface SqrManageRateAspectExtraDiscreteProps extends SqrManageRateAspectExtraProps {
}

export class SqrManageRateAspectExtraDiscrete extends React.Component<SqrManageRateAspectExtraDiscreteProps> {
    sqrManageRateStore: SqrManageRateStore = this.props.rootStore.sqrManageRateStore;

    render() {
        const {criteria, subcriteria, aspect} = this.props;
        const zedAspect = this.sqrManageRateStore.zedAspects.find((zedAspect) => zedAspect.id === aspect.zedLink);
        return <>
            {zedAspect?.mark === '1' ? <div className="zed_aspect_message">Оценка аннулирована отсекающим
                аспектом <b>"{zedAspect.caption}"</b></div> : <></>}
            <div className="extra_discrete">
                {aspect.extra?.map((extra) => (
                    <div key={`${aspect.id}-${extra.id}`}
                         className="extra_discrete__item">
                        <div className="extra_discrete__item_description">{extra.description}</div>
                        <DevsInput className="extra_discrete__item_mark"
                                   value={extra.mark}
                                   disabled={zedAspect?.mark === '1'}
                                   onChange={(event) => this.sqrManageRateStore.setAspectExtraDiscreteMark(criteria.id, subcriteria.id, aspect.id, extra.id, event.target.value)}
                        />
                    </div>
                ))}
            </div>
        </>
    }
}

const OSqrManageRateAspectExtraDiscrete = observer(SqrManageRateAspectExtraDiscrete);
export default OSqrManageRateAspectExtraDiscrete;
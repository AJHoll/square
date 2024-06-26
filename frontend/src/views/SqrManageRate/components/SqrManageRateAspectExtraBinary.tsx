import './SqrManageRateAspectExtraBinary.scss';
import React from "react";
import {observer} from "mobx-react";
import {SqrManageRateAspectExtraProps} from "./SqrManageRateAspectExtra";
import DevsRadioButton from "@ajholl/devsuikit/dist/DevsRadioButton";
import SqrManageRateStore from "../SqrManageRate.store";

export interface SqrManageRateAspectExtraBinaryProps extends SqrManageRateAspectExtraProps {
}

export class SqrManageRateAspectExtraBinary extends React.Component<SqrManageRateAspectExtraBinaryProps> {
    sqrManageRateStore: SqrManageRateStore = this.props.rootStore.sqrManageRateStore;

    render() {
        const {criteria, subcriteria, aspect} = this.props;
        const zedAspect = this.sqrManageRateStore.zedAspects.find((zedAspect) => zedAspect.id === aspect.zedLink);
        return <>
            {zedAspect?.mark === '1' ? <div className="zed_aspect_message">Оценка аннулирована отсекающим
                аспектом <b>"{zedAspect.caption}"</b></div> : <></>}
            <div className="extra_binary">
                <DevsRadioButton name={aspect.id}
                                 label="Да"
                                 labelSide="left"
                                 value={aspect.mark === '1'}
                                 disabled={zedAspect?.mark === '1'}
                                 onChange={() => this.sqrManageRateStore.setAspectExtraBinaryMark(criteria.id, subcriteria.id, aspect.id, true)}
                />
                <DevsRadioButton name={aspect.id}
                                 label="Нет"
                                 labelSide="left"
                                 value={aspect.mark === '0'}
                                 disabled={zedAspect?.mark === '1'}
                                 onChange={() => this.sqrManageRateStore.setAspectExtraBinaryMark(criteria.id, subcriteria.id, aspect.id, false)}
                />
            </div>
        </>
    }
}

const OSqrManageRateAspectExtraBinary = observer(SqrManageRateAspectExtraBinary);
export default OSqrManageRateAspectExtraBinary;
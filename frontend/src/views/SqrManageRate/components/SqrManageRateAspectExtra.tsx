import './SqrManageRateAspectExtra.scss';
import {StoreProps} from "../../../interfaces/StoreProps";
import {SqrCriteriaDto} from "../../../dtos/SqrCriteria.dto";
import {SqrSubcriteriaDto} from "../../../dtos/SqrSubcriteria.dto";
import {SqrAspectDto} from "../../../dtos/SqrAspect.dto";
import React from "react";
import SqrManageRateStore from "../SqrManageRate.store";
import {observer} from "mobx-react";
import OSqrManageRateAspectExtraBinary from "./SqrManageRateAspectExtraBinary";
import OSqrManageRateAspectExtraDiscrete from "./SqrManageRateAspectExtraDiscrete";
import OSqrManageRateAspectExtraJudge from "./SqrManageRateAspectExtraJudge";

export interface SqrManageRateAspectExtraProps extends StoreProps {
    criteria: SqrCriteriaDto,
    subcriteria: SqrSubcriteriaDto,
    aspect: SqrAspectDto,
}

export class SqrManageRateAspectExtra extends React.Component<SqrManageRateAspectExtraProps> {
    sqrManageRateStore: SqrManageRateStore = this.props.rootStore.sqrManageRateStore;

    render() {
        const {criteria, subcriteria, aspect} = this.props;
        switch (aspect.type) {
            case "B":
            case "Z": {
                return <OSqrManageRateAspectExtraBinary rootStore={this.props.rootStore}
                                                        criteria={criteria}
                                                        subcriteria={subcriteria}
                                                        aspect={aspect}/>
            }
            case "D": {
                return <OSqrManageRateAspectExtraDiscrete rootStore={this.props.rootStore}
                                                          criteria={criteria}
                                                          subcriteria={subcriteria}
                                                          aspect={aspect}/>
            }
            case "J": {
                return <OSqrManageRateAspectExtraJudge rootStore={this.props.rootStore}
                                                       criteria={criteria}
                                                       subcriteria={subcriteria}
                                                       aspect={aspect}/>
            }
        }
        return <span>Тип аспекта <b>{aspect.type}</b> не найден!</span>;
    }
}

const OSqrManageRateAspectExtra = observer(SqrManageRateAspectExtra);
export default OSqrManageRateAspectExtra;
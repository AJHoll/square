import './SqrManageAspectExtra.scss';
import React from "react";
import {StoreProps} from "../../../interfaces/StoreProps";
import {SqrCriteriaDto} from "../../../dtos/SqrCriteria.dto";
import {SqrSubcriteriaDto} from "../../../dtos/SqrSubcriteria.dto";
import {SqrAspectDto} from "../../../dtos/SqrAspect.dto";
import {observer} from "mobx-react";
import OSqrManageAspectExtraDiscrete from "./SqrManageAspectExtraDiscrete";
import OSqrManageAspectExtraJudge from "./SqrManageAspectExtraJudge";

export interface SqrManageAspectExtraProps extends StoreProps {
    criteria: SqrCriteriaDto,
    subcriteria: SqrSubcriteriaDto,
    aspect: SqrAspectDto,
}

export class SqrManageAspectExtra extends React.Component<SqrManageAspectExtraProps> {
    render() {
        const {criteria, subcriteria, aspect} = this.props;
        switch (aspect?.type) {
            case "D": {
                return <OSqrManageAspectExtraDiscrete rootStore={this.props.rootStore}
                                                      criteria={criteria}
                                                      subcriteria={subcriteria}
                                                      aspect={aspect}/>
            }
            case "J": {
                return <OSqrManageAspectExtraJudge rootStore={this.props.rootStore}
                                                   criteria={criteria}
                                                   subcriteria={subcriteria}
                                                   aspect={aspect}/>
            }
            default: {
                return <></>;
            }
        }
    }
}

const OSqrManageAspectExtra = observer(SqrManageAspectExtra);
export default OSqrManageAspectExtra;
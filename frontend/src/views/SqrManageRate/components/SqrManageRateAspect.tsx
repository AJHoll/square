import './SqrManageRateAspect.scss';
import {StoreProps} from "../../../interfaces/StoreProps";
import {SqrCriteriaDto} from "../../../dtos/SqrCriteria.dto";
import React from "react";
import SqrManageRateStore from "../SqrManageRate.store";
import {observer} from "mobx-react";
import {SqrSubcriteriaDto} from "../../../dtos/SqrSubcriteria.dto";
import {SqrAspectDto} from "../../../dtos/SqrAspect.dto";
import DevsPanel from "@ajholl/devsuikit/dist/DevsPanel";
import OSqrManageRateAspectExtra from "./SqrManageRateAspectExtra";

interface SqrManageRateAspectProps extends StoreProps {
    criteria: SqrCriteriaDto,
    subcriteria: SqrSubcriteriaDto,
    aspect: SqrAspectDto,
}

export class SqrManageRateAspect extends React.Component<SqrManageRateAspectProps> {
    sqrManageRateStore: SqrManageRateStore = this.props.rootStore.sqrManageRateStore;

    render() {
        const {criteria, subcriteria, aspect} = this.props;
        return <DevsPanel className="sqr_manage_rate_aspect">
            <div className="sqr_manage_rate_aspect__common">
                <div className="aspect_caption">{aspect.caption}</div>
                {
                    !!aspect.description ? <div className="aspect_description">{aspect.description}</div> : <></>
                }
            </div>
            <OSqrManageRateAspectExtra rootStore={this.props.rootStore}
                                       criteria={criteria}
                                       subcriteria={subcriteria}
                                       aspect={aspect}
            />
        </DevsPanel>;
    }
}

const OSqrManageRateAspect = observer(SqrManageRateAspect);
export default OSqrManageRateAspect;
import './SqrManageAspect.scss';
import React from "react";
import {StoreProps} from "../../../interfaces/StoreProps";
import {observer} from "mobx-react";
import {SqrCriteriaDto} from "../../../dtos/SqrCriteria.dto";
import {SqrSubcriteriaDto} from "../../../dtos/SqrSubcriteria.dto";
import {SqrAspectDto} from "../../../dtos/SqrAspect.dto";
import DevsPanel from "@ajholl/devsuikit/dist/DevsPanel";
import DevsSelect from "@ajholl/devsuikit/dist/DevsSelect";
import DevsTextArea from "@ajholl/devsuikit/dist/DevsTextArea";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import {SqrManageCriteriaStore} from "../SqrManageCriteria.store";
import OSqrManageAspectExtra from "./SqrManageAspectExtra";

export interface SqrManageAspectProps extends StoreProps {
    criteria: SqrCriteriaDto,
    subcriteria: SqrSubcriteriaDto,
    aspect: SqrAspectDto,
}

export class SqrManageAspect extends React.Component<SqrManageAspectProps> {
    sqrManageCriteriaStore: SqrManageCriteriaStore = this.props.rootStore.sqrManageCriteriaStore;

    render() {
        const {criteria, subcriteria, aspect} = this.props;
        const {aspectTypes} = this.sqrManageCriteriaStore;
        return <DevsPanel className="sqr_manage_aspect">
            <div className="sqr_manage_aspect__common">
                <label className="aspect_type">
                    Тип аспекта
                    <DevsSelect value={aspectTypes.find((type) => type.value === aspect.type)}
                                onlySelection
                                forceSelection
                                options={aspectTypes}
                                onChange={(event) =>
                                    this.sqrManageCriteriaStore.setAspectType(criteria.id, subcriteria.id, aspect.id, event.target.value.value)}
                    />
                </label>
                <label className="aspect_caption">
                    Название аспекта
                    <DevsTextArea value={aspect.caption}
                                  onChange={(event) =>
                                      this.sqrManageCriteriaStore.setAspectCaption(criteria.id, subcriteria.id, aspect.id, event.target.value)}
                    />
                </label>
                <label className="aspect_description">
                    Описание аспекта
                    <DevsTextArea value={aspect.description}
                                  onChange={(event) =>
                                      this.sqrManageCriteriaStore.setAspectDescription(criteria.id, subcriteria.id, aspect.id, event.target.value)}
                    />
                </label>
                <label className="aspect_mark">
                    Вес аспекта
                    <DevsInput keyFilter="num"
                               value={aspect.mark}
                               onChange={(event) =>
                                   this.sqrManageCriteriaStore.setAspectMark(criteria.id, subcriteria.id, aspect.id, event.target.value)}
                    />
                </label>
                <DevsButton template="outlined"
                            color="danger"
                            className="aspect_delete"
                            icon="lni lni-trash-can"
                            onClick={() => this.sqrManageCriteriaStore.removeAspect(criteria.id, subcriteria.id, aspect.id)}
                />
            </div>
            {
                ['D', 'J'].includes(aspect.type) ?
                    <OSqrManageAspectExtra rootStore={this.props.rootStore}
                                           criteria={criteria}
                                           subcriteria={subcriteria}
                                           aspect={aspect}/>
                    : <></>
            }
        </DevsPanel>
    }
}

const OSqrManageAspect = observer(SqrManageAspect);
export default OSqrManageAspect;
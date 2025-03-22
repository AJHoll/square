import './SqrManageSubcriteria.scss';
import {StoreProps} from "../../../interfaces/StoreProps";
import React from "react";
import {observer} from "mobx-react";
import DevsPanel from "@ajholl/devsuikit/dist/DevsPanel";
import {SqrManageCriteriaStore} from "../SqrManageCriteria.store";
import {SqrSubcriteriaDto} from "../../../dtos/SqrSubcriteria.dto";
import {SqrCriteriaDto} from "../../../dtos/SqrCriteria.dto";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import OSqrManageAspect from "./SqrManageAspect";
import {DevsInputWrapper} from "../../../components/DevsInputWrapper/DevsInputWrapper";
import DevsSelect from "@ajholl/devsuikit/dist/DevsSelect";

interface SqrManageSubcriteriaProps extends StoreProps {
    criteria: SqrCriteriaDto,
    subcriteria: SqrSubcriteriaDto,
}

export class SqrManageSubcriteria extends React.Component<SqrManageSubcriteriaProps> {
    sqrManageCriteriaStore: SqrManageCriteriaStore = this.props.rootStore.sqrManageCriteriaStore;

    render() {
        const {criteria, subcriteria} = this.props;
        return <DevsPanel className="sqr_manage_subcriteria">
        <span className="sqr_manage_subcriteria__key">
          {`${criteria.key}${subcriteria.order}`}
        </span>
            <div className="sqr_manage_subcriteria__right">
                <div className="sqr_manage_subcriteria__title">
                    <label className="sqr_manage_subcriteria__title-order">
                        № п.п
                        <DevsInput value={subcriteria.order}
                                   onChange={(event) =>
                                       this.sqrManageCriteriaStore.setSubcriteriaOrder(criteria.id, subcriteria.id, event.target.value)}
                        />
                    </label>
                    <label className="sqr_manage_subcriteria__title-module">
                        Модуль
                        {
                            !!criteria.module ? <DevsInputWrapper
                                    value={this.sqrManageCriteriaStore.modules.find(m => m.value === criteria.module)?.label}/>
                                : <DevsSelect options={this.sqrManageCriteriaStore.modules}
                                              value={this.sqrManageCriteriaStore.modules.find(m => m.value === subcriteria.module)}
                                              onlySelection={true}
                                              onChange={(event) => this.sqrManageCriteriaStore.setSubcriteriaModule(criteria.id, subcriteria.id, event.value?.value)}
                                />
                        }

                    </label>
                    <label className="sqr_manage_subcriteria__title-caption">
                        Название субкритерия
                        <DevsInput value={subcriteria.caption}
                                   onChange={(event) =>
                                       this.sqrManageCriteriaStore.setSubcriteriaCaption(criteria.id, subcriteria.id, event.target.value)}
                        />
                    </label>
                    <DevsButton template="outlined"
                                color="primary"
                                className="app_skill_item__create"
                                icon="lni lni-plus"
                                title="Аспект"
                                onClick={() => this.sqrManageCriteriaStore.addAspect(criteria.id, subcriteria.id)}
                    />
                    <DevsButton template="outlined"
                                color="danger"
                                className="app_skill_item__delete"
                                icon="lni lni-trash-can"
                                onClick={() => this.sqrManageCriteriaStore.removeSubcriteria(criteria.id, subcriteria.id)}
                    />
                </div>
                <div className="sqr_manage_subcriteria__content">
                    {
                        subcriteria.aspects.map((aspect) => (
                            <OSqrManageAspect key={aspect.id}
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

const OSqrManageSubcriteria = observer(SqrManageSubcriteria);
export default OSqrManageSubcriteria;
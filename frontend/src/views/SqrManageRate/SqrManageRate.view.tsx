import './SqrManageRate.view.scss';
import React from "react";
import {BaseViewProps} from "../../interfaces/BaseViewProps";
import SqrManageRateStore from "./SqrManageRate.store";
import DevsSelect from "@ajholl/devsuikit/dist/DevsSelect";
import {observer} from "mobx-react";
import OSqrManageRateCriteria from "./components/SqrManageRateCriteria";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import UserService from "../../services/User.service";

export interface SqrManageRatePrps extends BaseViewProps {
}

export class SqrManageRateView extends React.Component<SqrManageRatePrps> {
    sqrManageRateStore: SqrManageRateStore = this.props.rootStore.sqrManageRateStore;
    userService: UserService = this.props.rootStore.rootService.userService;

    sqareSelectRef: React.RefObject<DevsSelect> = React.createRef();
    evalGroupSelectRef: React.RefObject<DevsSelect> = React.createRef();
    moduleSelectRef: React.RefObject<DevsSelect> = React.createRef();
    teamSelectRef: React.RefObject<DevsSelect> = React.createRef();

    async componentDidMount(): Promise<void> {
        document.title = this.props.title;
        await this.sqrManageRateStore.init(this.sqareSelectRef, this.evalGroupSelectRef, this.moduleSelectRef, this.teamSelectRef);
    }

    render() {
        return <div className="sqr_manage_rate_view">
            <div className="sqr_manage_rate_view__toolbar">
                <DevsSelect ref={this.sqareSelectRef}
                            addonBefore={<span style={{paddingLeft: '10px', paddingRight: '10px'}}>Площадка</span>}
                            options={this.sqrManageRateStore.squares}
                            value={this.sqrManageRateStore.selectedSquare}
                            onlySelection={true}
                            onChange={(event) => this.sqrManageRateStore.selectedSquare = event.value}
                />
                <DevsSelect ref={this.evalGroupSelectRef}
                            addonBefore={<span
                                style={{paddingLeft: '10px', paddingRight: '10px'}}>Группа проверки</span>}
                            options={this.sqrManageRateStore.evalGroups}
                            value={this.sqrManageRateStore.selectedEvalGroup}
                            onlySelection={true}
                            onChange={(event) => this.sqrManageRateStore.selectedEvalGroup = event.value}
                />
                <DevsSelect ref={this.moduleSelectRef}
                            addonBefore={<span
                                style={{paddingLeft: '10px', paddingRight: '10px'}}>Модуль</span>}
                            options={this.sqrManageRateStore.modules}
                            value={this.sqrManageRateStore.selectedModule}
                            onlySelection={true}
                            onChange={(event) => this.sqrManageRateStore.selectedModule = event.value}
                />
                <DevsSelect ref={this.teamSelectRef}
                            addonBefore={<span
                                style={{paddingLeft: '10px', paddingRight: '10px'}}>Команда</span>}
                            options={this.sqrManageRateStore.teams}
                            value={this.sqrManageRateStore.selectedTeam}
                            onlySelection={true}
                            onChange={(event) => this.sqrManageRateStore.selectedTeam = event.value}
                />
                <DevsButton template="filled"
                            color="success"
                            title="Сохранить"
                            icon="lni lni-save"
                            onClick={() => this.sqrManageRateStore.saveRates()}
                />
                {
                    (this.userService.user?.roles ?? []).includes('admin') ||
                    (this.userService.user?.roles ?? []).includes('rateExporter')
                        ? <DevsButton template="filled"
                                      color="secondary"
                                      title="в XLSX"
                                      icon="lni lni-upload"
                                      onClick={() => this.sqrManageRateStore.downloadXLSX()}
                        /> : <></>
                }

            </div>
            <div className="sqr_manage_rate_view__content">
                {this.sqrManageRateStore.rates.map((rateCriteria) => (
                    <OSqrManageRateCriteria rootStore={this.props.rootStore}
                                            key={rateCriteria.id}
                                            criteria={rateCriteria}
                    />))}
            </div>
        </div>
    }
}

const OSqrManageRateView = observer(SqrManageRateView);
export default OSqrManageRateView;
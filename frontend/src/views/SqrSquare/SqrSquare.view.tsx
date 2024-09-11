import {observer} from "mobx-react";
import React from "react";
import {BaseViewProps} from "../../interfaces/BaseViewProps";
import './SqrSquare.view.scss';
import OSqrSquareCard from "./components/SqrSquareCard";
import OSqrSquare from "./components/SqrSquare";
import DevsSplitter from "@ajholl/devsuikit/dist/DevsSplitter";
import DevsSplitterPanel from "@ajholl/devsuikit/dist/DevsSplitterPanel";
import DevsTabView from "@ajholl/devsuikit/dist/DevsTabView";
import DevsTabPanel from "@ajholl/devsuikit/dist/DevsTabPanel";
import OSqrSquareUser from "./components/SqrSquareUser";
import OSqrSquareTeam from "./components/SqrSquareTeam";
import OSqrSquareTimer from "./components/SqrSquareTimer";
import OSqrSquareEvalGroup from "./components/SqrSquareEvalGroup";
import UserService from "../../services/User.service";

interface SqrSquareViewProps extends BaseViewProps {
}

export class SqrSquareView extends React.Component<SqrSquareViewProps> {
    readonly userService: UserService = this.props.rootStore.rootService.userService;

    componentDidMount() {
        document.title = this.props.title;
    }

    render() {
        let activePanelNames: string[] = [];
        if ((this.userService.user?.roles ?? []).includes('admin') ||
            (this.userService.user?.roles ?? []).includes('squareManage')) {
            activePanelNames = ['roles', 'teams', 'timers', 'eval-groups'];
        }
        if ((this.userService.user?.roles ?? []).includes('timerManage')) {
            activePanelNames = ['timers'];
        }
        return (
            <div className="sqr_square_view">
                <OSqrSquareCard rootStore={this.props.rootStore}/>
                <div className="sqr_square_view__content">
                    <DevsSplitter layout="vertical">
                        <DevsSplitterPanel>
                            <OSqrSquare rootStore={this.props.rootStore}/>
                        </DevsSplitterPanel>
                        <DevsSplitterPanel>
                            <DevsTabView>
                                {
                                    activePanelNames.map((panelName) => {
                                        switch (panelName) {
                                            case "roles": {
                                                return <DevsTabPanel key="roles" header="Роли на площадке">
                                                    <OSqrSquareUser rootStore={this.props.rootStore}/>
                                                </DevsTabPanel>
                                            }
                                            case "teams": {
                                                return <DevsTabPanel key="teams" header="Команды">
                                                    <OSqrSquareTeam rootStore={this.props.rootStore}/>
                                                </DevsTabPanel>
                                            }
                                            case "timers": {
                                                return <DevsTabPanel key="timers" header="Таймеры">
                                                    <OSqrSquareTimer rootStore={this.props.rootStore}/>
                                                </DevsTabPanel>
                                            }
                                            case "eval-groups": {
                                                return <DevsTabPanel key="eval-groups" header="Группы проверки">
                                                    <OSqrSquareEvalGroup rootStore={this.props.rootStore}/>
                                                </DevsTabPanel>
                                            }
                                        }
                                        return undefined;
                                    })
                                }
                            </DevsTabView>
                        </DevsSplitterPanel>
                    </DevsSplitter>

                </div>
            </div>
        )
    }
}

const OSqrSquareView = observer(SqrSquareView);
export default OSqrSquareView;
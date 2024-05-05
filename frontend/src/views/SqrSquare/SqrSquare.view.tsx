import {observer} from "mobx-react";
import React from "react";
import {BaseViewProps} from "../../interfaces/BaseViewProps";
import './SqrSquare.view.scss';
import ViewHeader from "../../components/ViewHeader/ViewHeader";
import OSqrSquareCard from "./components/SqrSquareCard";
import OSqrSquare from "./components/SqrSquare";
import DevsSplitter from "@ajholl/devsuikit/dist/DevsSplitter";
import DevsSplitterPanel from "@ajholl/devsuikit/dist/DevsSplitterPanel";
import DevsTabView from "@ajholl/devsuikit/dist/DevsTabView";
import DevsTabPanel from "@ajholl/devsuikit/dist/DevsTabPanel";
import OSqrSquareUser from "./components/SqrSquareUser";
import OSqrSquareTeam from "./components/SqrSquareTeam";
import OSqrSquareTimer from "./components/SqrSquareTimer";

interface SqrSquareViewProps extends BaseViewProps {
}

export class SqrSquareView extends React.Component<SqrSquareViewProps> {
    componentDidMount() {
        document.title = this.props.title;
    }

    render() {
        return (
            <div className="sqr_square_view">
                <OSqrSquareCard rootStore={this.props.rootStore}/>
                <ViewHeader title="Управление площадками"/>
                <div className="sqr_square_view__content">
                    <DevsSplitter layout="vertical">
                        <DevsSplitterPanel>
                            <OSqrSquare rootStore={this.props.rootStore}/>
                        </DevsSplitterPanel>
                        <DevsSplitterPanel>
                            <DevsTabView>
                                <DevsTabPanel header="Роли на площадке">
                                    <OSqrSquareUser rootStore={this.props.rootStore}/>
                                </DevsTabPanel>
                                <DevsTabPanel header="Команды">
                                    <OSqrSquareTeam rootStore={this.props.rootStore}/>
                                </DevsTabPanel>
                                <DevsTabPanel header="Таймеры">
                                    <OSqrSquareTimer rootStore={this.props.rootStore}/>
                                </DevsTabPanel>
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
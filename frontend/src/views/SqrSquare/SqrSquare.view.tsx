import {observer} from "mobx-react";
import React from "react";
import {BaseViewProps} from "../../interfaces/BaseViewProps";
import './SqrSquare.view.scss';
import ViewHeader from "../../components/ViewHeader/ViewHeader";
import OSqrSquareCard from "./components/SqrSquareCard";
import OSqrSquare from "./components/SqrSquare";

interface SqrSquareViewProps extends BaseViewProps {
}

export class SqrSquareView extends React.Component<SqrSquareViewProps> {
    componentDidMount() {
        document.title = this.props.title;
    }

    render() {
        return (
            <div className="adm_square_view">
                <OSqrSquareCard rootStore={this.props.rootStore}/>
                <ViewHeader title="Управление площадками"/>
                <div className="adm_square_view__content">
                    <OSqrSquare rootStore={this.props.rootStore}/>
                </div>
            </div>
        )
    }
}

const OSqrSquareView = observer(SqrSquareView);
export default OSqrSquareView;
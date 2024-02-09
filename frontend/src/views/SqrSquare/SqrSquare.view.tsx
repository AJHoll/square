import {observer} from "mobx-react";
import React from "react";
import {BaseViewProps} from "../../interfaces/BaseViewProps";
import './SqrSquare.view.scss';
import ViewHeader from "../../components/ViewHeader/ViewHeader";

interface SqrSquareViewProps extends BaseViewProps {
}

export class SqrSquareView extends React.Component<SqrSquareViewProps> {
    componentDidMount() {
        document.title = this.props.title;
    }

    render() {
        return (
            <div className="adm_square_view">
                <ViewHeader title="Управление площадками"/>
                <div className="adm_square_view__content">
                </div>
            </div>
        )
    }
}

const OSqrSquareView = observer(SqrSquareView);
export default OSqrSquareView;
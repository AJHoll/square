import {BaseViewProps} from '../../interfaces/BaseViewProps';
import React from 'react';
import {observer} from 'mobx-react';
import './SqrRole.view.scss';
import OSqrRoleCard from "./components/SqrRoleCard";
import OSqrRole from "./components/SqrRole";

interface SqrRoleViewProps extends BaseViewProps {
}

export class SqrRoleView extends React.Component<SqrRoleViewProps> {

    componentDidMount() {
        document.title = this.props.title;
    }

    render() {
        return (
            <div className="adm_square_role_view">
                <OSqrRoleCard rootStore={this.props.rootStore}/>
                <div className="adm_square_role_view__content">
                    <OSqrRole rootStore={this.props.rootStore}/>
                </div>
            </div>
        )
    }
}

const OSqrRoleView = observer(SqrRoleView);
export default OSqrRoleView;
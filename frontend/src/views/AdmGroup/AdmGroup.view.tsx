import './AdmGroup.view.scss';
import React from 'react';
import {BaseViewProps} from '../../interfaces/BaseViewProps';
import {observer} from 'mobx-react';
import DevsSplitter from '@ajholl/devsuikit/dist/DevsSplitter';
import DevsSplitterPanel from '@ajholl/devsuikit/dist/DevsSplitterPanel';
import DevsTabView from '@ajholl/devsuikit/dist/DevsTabView';
import DevsTabPanel from '@ajholl/devsuikit/dist/DevsTabPanel';
import OAdmGroupCard from './components/AdmGroupCard';
import OAdmGroup from './components/AdmGroup';
import OAdmGroupRole from './components/AdmGroupRole';


interface AdmGroupViewProps extends BaseViewProps {
}

export class AdmGroupView extends React.Component<AdmGroupViewProps> {

    componentDidMount() {
        document.title = this.props.title;
    }

    render() {
        return (
            <div className="adm_group_view">
                <OAdmGroupCard rootStore={this.props.rootStore}/>
                <div className="adm_group_view__content">
                    <DevsSplitter layout="vertical">
                        <DevsSplitterPanel>
                            <OAdmGroup rootStore={this.props.rootStore}/>
                        </DevsSplitterPanel>
                        <DevsSplitterPanel>
                            <DevsTabView>
                                <DevsTabPanel header="Роли">
                                    <OAdmGroupRole rootStore={this.props.rootStore}/>
                                </DevsTabPanel>
                            </DevsTabView>
                        </DevsSplitterPanel>
                    </DevsSplitter>
                </div>
            </div>
        );
    }
}

const OAdmGroupView = observer(AdmGroupView);
export default OAdmGroupView;
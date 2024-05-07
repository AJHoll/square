import './AdmUser.view.scss';
import React from "react";
import {BaseViewProps} from "../../interfaces/BaseViewProps";
import {observer} from "mobx-react";
import DevsSplitter from "@ajholl/devsuikit/dist/DevsSplitter";
import DevsSplitterPanel from "@ajholl/devsuikit/dist/DevsSplitterPanel";
import DevsTabView from "@ajholl/devsuikit/dist/DevsTabView";
import DevsTabPanel from "@ajholl/devsuikit/dist/DevsTabPanel";
import OAdmUserCard from "./components/AdmUserCard";
import OAdmUser from "./components/AdmUser";
import OAdmUserGroup from "./components/AdmUserGroup";

interface AdmUserViewProps extends BaseViewProps {
}

export class AdmUserView extends React.Component<AdmUserViewProps> {
    componentDidMount() {
        document.title = this.props.title;
    }

    render() {
        return (
            <div className="adm_user_view">
                <OAdmUserCard rootStore={this.props.rootStore}/>
                <div className="adm_user_view__content">
                    <DevsSplitter layout="vertical">
                        <DevsSplitterPanel>
                            <OAdmUser rootStore={this.props.rootStore}/>
                        </DevsSplitterPanel>
                        <DevsSplitterPanel>
                            <DevsTabView>
                                <DevsTabPanel header="Группы">
                                    <OAdmUserGroup rootStore={this.props.rootStore}/>
                                </DevsTabPanel>
                            </DevsTabView>
                        </DevsSplitterPanel>
                    </DevsSplitter>
                </div>
            </div>
        );
    }
}

const OAdmUserView = observer(AdmUserView);
export default OAdmUserView;
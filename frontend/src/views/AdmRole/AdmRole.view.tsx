import { BaseViewProps } from '../../interfaces/BaseViewProps';
import React from 'react';
import OAdmRoleCard from './components/AdmRoleCard';
import ViewHeader from '../../components/ViewHeader/ViewHeader';
import DevsSplitter from '@ajholl/devsuikit/dist/DevsSplitter';
import DevsSplitterPanel from '@ajholl/devsuikit/dist/DevsSplitterPanel';
import DevsTabView from '@ajholl/devsuikit/dist/DevsTabView';
import DevsTabPanel from '@ajholl/devsuikit/dist/DevsTabPanel';
import { observer } from 'mobx-react';
import OAdmRole from './components/AdmRole';
import './AdmRole.view.scss';
import OAdmRoleMenu from './components/AdmRoleMenu';

interface AdmRoleWithTabsViewProps extends BaseViewProps {
}

export class AdmRoleView extends React.Component<AdmRoleWithTabsViewProps> {

  componentDidMount() {
    document.title = this.props.title;
  }

  render() {
    return (
      <div className="adm_role_view">
        <OAdmRoleCard rootStore={this.props.rootStore} />
        <ViewHeader title="Управление ролями" />
        <div className="adm_role_view__content">
          <DevsSplitter layout="vertical">
            <DevsSplitterPanel>
              <OAdmRole rootStore={this.props.rootStore} />
            </DevsSplitterPanel>
            <DevsSplitterPanel>
              <DevsTabView>
                <DevsTabPanel header="Пункты меню">
                  <OAdmRoleMenu rootStore={this.props.rootStore} />
                </DevsTabPanel>
              </DevsTabView>
            </DevsSplitterPanel>
          </DevsSplitter>
        </div>
      </div>
    )
  }
}

const OAdmRoleView = observer(AdmRoleView);
export default OAdmRoleView;
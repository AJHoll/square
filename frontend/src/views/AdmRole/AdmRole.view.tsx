import { BaseViewProps } from '../../interfaces/BaseViewProps';
import React from 'react';
import { AdmRoleCard } from './components/AdmRoleCard';
import ViewHeader from '../../components/ViewHeader/ViewHeader';
import DevsSplitter from '@ajholl/devsuikit/dist/DevsSplitter';
import DevsSplitterPanel from '@ajholl/devsuikit/dist/DevsSplitterPanel';
import DevsTabView from '@ajholl/devsuikit/dist/DevsTabView';
import DevsTabPanel from '@ajholl/devsuikit/dist/DevsTabPanel';
import { AdmRoleMenu } from './components/AdmRoleMenu';
import { observer } from 'mobx-react';
import OAdmRole from './components/AdmRole';
import './AdmRole.view.scss';

interface AdmRoleWithTabsViewProps extends BaseViewProps {
}

export class AdmRoleView extends React.Component<AdmRoleWithTabsViewProps> {
  readonly title = 'Управление ролями';

  render() {
    return (
      <>
        <div className="adm_role_view">
          <AdmRoleCard rootStore={this.props.rootStore} />
          <ViewHeader title={this.title} />
          <div className="adm_role_view__content">
            <DevsSplitter layout="vertical">
              <DevsSplitterPanel>
                <OAdmRole rootStore={this.props.rootStore} />
              </DevsSplitterPanel>
              <DevsSplitterPanel>
                <DevsTabView>
                  <DevsTabPanel header="Пункты меню">
                    <AdmRoleMenu rootStore={this.props.rootStore} />
                  </DevsTabPanel>
                </DevsTabView>
              </DevsSplitterPanel>
            </DevsSplitter>
          </div>
        </div>
      </>
    )
  }
}

const OadmRoleView = observer(AdmRoleView);
export default OadmRoleView;
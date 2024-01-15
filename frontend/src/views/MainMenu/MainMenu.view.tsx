import './MainMenu.view.scss';
import React from 'react';
import { observer } from 'mobx-react';
import { BaseViewProps } from '../../interfaces/BaseViewProps';
import MainMenuStore from './MainMenu.store';
import MainMenuGroup from './components/MainMenuGroup';
import { RouteComponentProps } from 'react-router-dom';

export interface MainMenuProps extends BaseViewProps, RouteComponentProps {
}

export class MainMenuView extends React.Component<MainMenuProps> {
  mainMenuStore: MainMenuStore = this.props.rootStore.mainMenuStore;

  async componentDidMount(): Promise<void> {
    document.title = this.props.title;
    await this.mainMenuStore.reloadMainMenu();
  }

  render(): React.ReactNode {
    return (
      <div className="app_main_menu">
        <div className="app_main_menu__icon">
          <img src="/assets/icon.svg" alt="logo" />
          <div className="app_main_menu__icon-text">
            <span>{this.props.rootStore.projectName}</span>
            <p>by <a href="https://devsystem.space">devsystem.space</a></p>
          </div>
        </div>
        <div className="app_main_menu__content">
          {
            this.mainMenuStore.menu.map((group) => (
              <MainMenuGroup key={group.id} id={group.id} title={group.title} order={group.order} items={group.items}
                             location={this.props.location} history={this.props.history}
                             match={this.props.match} />))
          }
        </div>
      </div>
    );
  }
}

const OMainMenuView = observer(MainMenuView);
export default OMainMenuView;

import React from 'react';
import './MainMenuItem.scss';
import DevsPanel from '@ajholl/devsuikit/dist/DevsPanel';
import { MainMenuItemDto } from '../../../dtos/MainMenuItem.dto';
import { RouteComponentProps } from 'react-router-dom';

interface MainManuItemProps extends MainMenuItemDto, RouteComponentProps {
}

export default class MainMenuItem extends React.Component<MainManuItemProps> {
  render() {
    const { title, icon, url, history } = this.props;
    return (
      <DevsPanel className="app_menu_item"
                 onClick={() => {
                   history.push(url);
                 }}
      >
        <div className="app_menu_item__icon">
          <i className={`lni ${icon ?? 'lni-bookmark'}`}></i>
        </div>
        <div className="app_menu_item__content">
          {title}
        </div>
      </DevsPanel>
    );
  }
}

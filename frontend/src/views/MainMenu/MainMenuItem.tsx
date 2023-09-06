import React from 'react';
import './MainMenuItem.scss';
import DevsPanel from '@ajholl/devsuikit/dist/DevsPanel';

interface MainManuItemProps {
  id: string;
  title: string;
  icon?: string;
  selectMenuItem: (menuItemId: string) => void;
}

export default class MainMenuItem extends React.Component<MainManuItemProps> {
  render() {
    const { id, title, icon, selectMenuItem } = this.props;
    return (
      <DevsPanel className="app_menu_item"
                 onClick={() => {
               selectMenuItem(id);
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

import './MainMenu.scss';
import React from 'react';
import { observer } from 'mobx-react';
import { BaseViewProps } from '../../interfaces/BaseViewProps';

export interface MainMenuProps extends BaseViewProps {
}

export class MainMenu extends React.Component<MainMenuProps> {

  async componentDidMount(): Promise<void> {
  }

  render(): React.ReactNode {
    return (
      <><p>main-menu-worksh!</p></>
    );
  }
}

const OMainMenu = observer(MainMenu);
export default OMainMenu;

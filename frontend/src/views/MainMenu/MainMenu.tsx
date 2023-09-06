import './MainMenu.scss';
import React from 'react';
import { observer } from 'mobx-react';
import { StoreProps } from '../../interfaces/StoreProps';
import { TitleProps } from '../../interfaces/TitleProps';
import { RouteComponentProps } from 'react-router-dom';

export interface MainMenuProps extends RouteComponentProps, StoreProps, TitleProps{
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

import React from 'react';
import { MainMenuGroupDto } from '../../../dtos/MainMenuGroup.dto';
import DevsPanel from '@ajholl/devsuikit/dist/DevsPanel';
import MainMenuItem from './MainMenuItem';
import { RouteComponentProps } from 'react-router-dom';
import './MainMenuGroup.scss';

interface MainMenuGroupProps extends MainMenuGroupDto, RouteComponentProps {
}

export default class MainMenuGroup extends React.Component<MainMenuGroupProps> {
  render() {
    return (
      <DevsPanel className="main_menu_group">
        <div className="main_menu_group__title">
          <div className="title_icon">
            <div className={this.props.icon ?? 'lni lni-folder'}></div>
          </div>
          <div className="title_content">{this.props.title}</div>
        </div>
        <div className="main_menu_group__items">
          {this.props.items.map((item) => {
            return (<MainMenuItem key={item.id}
                                  id={item.id}
                                  title={item.title}
                                  url={item.url}
                                  icon={item.icon}
                                  history={this.props.history}
                                  location={this.props.location}
                                  match={this.props.match}
            />)
          })}
        </div>
      </DevsPanel>
    );
  }
}
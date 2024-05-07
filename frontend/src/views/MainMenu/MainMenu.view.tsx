import './MainMenu.view.scss';
import React from 'react';
import {observer} from 'mobx-react';
import {BaseViewProps} from '../../interfaces/BaseViewProps';
import MainMenuStore from './MainMenu.store';
import MainMenuGroup from './components/MainMenuGroup';
import {RouteComponentProps} from 'react-router-dom';
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import UserService from "../../services/User.service";
import AuthService from "../../services/Auth.service";

export interface MainMenuProps extends BaseViewProps, RouteComponentProps {
}

export class MainMenuView extends React.Component<MainMenuProps> {
    mainMenuStore: MainMenuStore = this.props.rootStore.mainMenuStore;
    userService: UserService = this.props.rootStore.rootService.userService;
    authService: AuthService = this.props.rootStore.rootService.authService;

    async componentDidMount(): Promise<void> {
        document.title = this.props.title;
        await this.mainMenuStore.reloadMainMenu();
    }

    render(): React.ReactNode {
        return (
            <div className="app_main_menu">
                <div className="app_main_menu__logout">
                    <span className="greetings_text">Здравствуйте, {this.userService.user?.caption}</span>
                    <div className="logout_btn">
                        <DevsButton template={"outlined"}
                                    color={"primary"}
                                    title="Выйти"
                                    icon="lni lni-exit"
                                    onClick={() => this.authService.logout()}
                        />
                    </div>
                </div>
                <div className="app_main_menu__icon">
                    <svg width="100" height="92" viewBox="0 0 300 275" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M119.248 19.7491L50.9242 59.1959L119.425 98.1834L187.708 59.2405L119.248 19.7491Z"
                              fill="#97D902"/>
                        <path d="M51.162 137.678L119.486 177.125L119.425 98.1832L51.162 58.7841L51.162 137.678Z"
                              fill="#A5ED00"/>
                        <path d="M187.708 59.2403L119.425 98.183L187.748 138.119L256.072 98.6722L187.708 59.2403Z"
                              fill="#333333"/>
                        <path d="M255.835 177.154L255.835 98.2605L187.175 137.66L187.175 216.612L255.835 177.154Z"
                              fill="#404040"/>
                        <path d="M51.1416 216.553L119.465 256L119.465 177.106L51.1416 137.659L51.1416 216.553Z"
                              fill="#3C88CA"/>
                        <path d="M187.314 216.553V137.659L118.99 177.106L118.99 256L187.314 216.553Z" fill="#3E8DD1"/>
                    </svg>
                    <div className="app_main_menu__icon-text">
                        <span>{this.props.rootStore.projectName}</span>
                        <p>by <a href="https://devsystem.space">devsystem.space</a></p>
                    </div>
                </div>
                <div className="app_main_menu__search">
                    <DevsInput placeholder='Для поиска, просто начните вводить искомое значение...'
                               addonBefore={<span style={{padding: '0 10px'}}>Поиск</span>}
                               addonAfter={<DevsButton template="outlined"
                                                       color="secondary"
                                                       icon="lni lni-search-alt"
                                                       style={{border: '0', borderRadius: '0'}}
                                                       onClick={() => this.mainMenuStore.reloadMainMenu()}
                               />}
                               onKeyUp={async (event) => {
                                   if (event.key === 'Enter') {
                                       await this.mainMenuStore.reloadMainMenu();
                                   }
                               }}
                               onChange={(event) => this.mainMenuStore.menuFilter = event.target?.value}
                    />
                </div>
                <div className="app_main_menu__content devs_styled_scrool">
                    {
                        this.mainMenuStore.menu.map((group) => (
                            <MainMenuGroup key={group.id} id={group.id} title={group.title} icon={group.icon}
                                           order={group.order} items={group.items}
                                           location={this.props.location} history={this.props.history}
                                           match={this.props.match}/>))
                    }
                </div>
            </div>
        );
    }
}

const OMainMenuView = observer(MainMenuView);
export default OMainMenuView;

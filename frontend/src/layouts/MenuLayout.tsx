import './MenuLayout.scss';
import React from "react";
import {StoreProps} from "../interfaces/StoreProps";
import {observer} from "mobx-react";
import MainMenuStore from "../views/MainMenu/MainMenu.store";
import DevsMenubar from "@ajholl/devsuikit/dist/DevsMenubar";
import {RouteComponentProps} from "react-router-dom";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import AuthService from "../services/Auth.service";

interface MenuLayoutProps extends RouteComponentProps, StoreProps {
    children: React.ReactNode;
    title?: string;
    hideEnd?: boolean;
}

export class MenuLayout extends React.Component<MenuLayoutProps> {
    mainMenuStore: MainMenuStore = this.props.rootStore.mainMenuStore;
    authService: AuthService = this.props.rootStore.rootService.authService;

    async componentDidMount(): Promise<void> {
        await this.mainMenuStore.initMenubar(this.props);
    }

    render() {
        const {hideEnd} = this.props;
        const start: React.ReactNode = <div className="devs_menu_layout__menubar-start">
            <div className="devs_menu_home_btn"
                 onClick={() => this.props.history.push('/')}
            >
                <svg width="35" height="33" viewBox="0 0 300 275" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </div>
            {this.props?.title ? <span className="title">{this.props.title}</span> : undefined}
        </div>;

        const end: React.ReactNode = <div className="devs_menu_layout__menubar-end">
            <DevsButton template={"outlined"}
                        color={"primary"}
                        title="Профиль"
                        icon="lni lni-user"
                        onClick={() => this.props.history.push('/profile')}/>
            <DevsButton template={"outlined"}
                        color={"primary"}
                        title="Выйти"
                        icon="lni lni-exit"
                        onClick={() => this.authService.logout()}/>
        </div>

        return <div className="devs_menu_layout">
            <div className="devs_menu_layout__menubar">
                <DevsMenubar start={start}
                             end={hideEnd ? undefined : end}
                             model={this.mainMenuStore.menubarItems}
                />
            </div>
            <div className="devs_menu_layout__content">
                {this.props.children}
            </div>
        </div>;
    }
}

const OMenuLayout = observer(MenuLayout);
export default OMenuLayout;
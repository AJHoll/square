import './MenuLayout.scss';
import React from "react";
import {StoreProps} from "../interfaces/StoreProps";
import {observer} from "mobx-react";
import MainMenuStore from "../views/MainMenu/MainMenu.store";
import DevsMenubar from "@ajholl/devsuikit/dist/DevsMenubar";
import {RouteComponentProps} from "react-router-dom";

interface MenuLayoutProps extends RouteComponentProps, StoreProps {
    children: React.ReactNode;
    title?: string;
}

export class MenuLayout extends React.Component<MenuLayoutProps> {
    mainMenuStore: MainMenuStore = this.props.rootStore.mainMenuStore;

    async componentDidMount(): Promise<void> {
        await this.mainMenuStore.initMenubar(this.props);
    }

    render() {
        const start: React.ReactNode = <div className="devs_menu_layout__menubar-start">
            <img src="/assets/icon.svg"
                 className="devs_menu_home_btn"
                 alt="logo"
                 width={35}
                 height={35}
                 onClick={() => this.props.history.push('/')}/>
            {this.props?.title ? <span className="title">{this.props.title}</span> : undefined}
        </div>;
        return <div className="devs_menu_layout">
            <div className="devs_menu_layout__menubar">
                <DevsMenubar start={start}
                             model={this.mainMenuStore.menubarItems}/>
            </div>
            <div className="devs_menu_layout__content">
                {this.props.children}
            </div>
        </div>;
    }
}

const OMenuLayout = observer(MenuLayout);
export default OMenuLayout;
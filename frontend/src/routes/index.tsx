import React from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'
import AuthGuardRoute from './AuthGuardRoute';
import OAuthView from '../views/Auth/Auth.view';
import { StoreProps } from '../interfaces/StoreProps';
import OAdmRoleView from '../views/AdmRole/AdmRole.view';
import OMainMenuView from '../views/MainMenu/MainMenu.view';
import DevsToast from '@ajholl/devsuikit/dist/DevsToast';

interface RoutesProps extends StoreProps {
}

export default class Routes extends React.Component<RoutesProps> {
  toastRef: React.RefObject<DevsToast> = React.createRef<DevsToast>();

  componentDidMount() {
    this.props.rootStore.toastRef = this.toastRef;
  }

  getTitle(viewHeader: string) {
    return `${this.props.rootStore.projectName} - ${viewHeader}`;
  }

  render() {
    return (
      <>
        <Router>
          <Switch>
            <AuthGuardRoute exact
                            path="/"
                            rootStore={this.props.rootStore}
                            render={(routeProps: RouteComponentProps) =>
                              <OMainMenuView {...routeProps}
                                             rootStore={this.props.rootStore}
                                             title={this.getTitle('Главное меню')}
                              />}
            />
            <AuthGuardRoute exact
                            path="/roles"
                            rootStore={this.props.rootStore}
                            render={(routeProps: RouteComponentProps) =>
                              <OAdmRoleView {...routeProps}
                                            rootStore={this.props.rootStore}
                                            title={this.getTitle('Управление ролями')}
                              />}
            />
            <Route exact
                   path="/auth"
                   render={(routeProps: RouteComponentProps) =>
                     <OAuthView {...routeProps}
                                rootStore={this.props.rootStore}
                                title={this.getTitle('Авторизация')}
                     />}
            />
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Router>
        <DevsToast ref={this.toastRef} appendTo="self" /></>
    )
  }
}
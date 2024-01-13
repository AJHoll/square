import React from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'
import AuthGuardRoute from './AuthGuardRoute';
import OAuthView from '../views/Auth/Auth.view';
import OMainMenu from '../views/MainMenu/MainMenu';
import { StoreProps } from '../interfaces/StoreProps';
import OAdmRoleView from '../views/AdmRole/AdmRole.view';

interface RoutesProps extends StoreProps {
}

export default class Routes extends React.Component<RoutesProps> {
  getTitle(viewHeader: string) {
    return `${this.props.rootStore.projectName} - ${viewHeader}`;
  }

  render() {
    return <Router>
      <Switch>
        <AuthGuardRoute exact
                        path="/"
                        rootStore={this.props.rootStore}
                        render={(routeProps: RouteComponentProps) =>
                          <OMainMenu {...routeProps}
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
          <Redirect to="/"/>
        </Route>
      </Switch>
    </Router>
  }
}
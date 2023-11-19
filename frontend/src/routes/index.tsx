import React from 'react';
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from 'react-router-dom'
import AuthGuardRoute from './AuthGuardRoute';
import OAuthView from '../views/Auth/Auth.view';
import OMainMenu from '../views/MainMenu/MainMenu';
import { StoreProps } from '../interfaces/StoreProps';

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
        <Route exact
               path="/auth"
               render={(routeProps: RouteComponentProps) =>
                 <OAuthView {...routeProps}
                            rootStore={this.props.rootStore}
                            title={this.getTitle('Авторизация')}
                 />}
        />
        <Route path="*">
          <p>404 - page not found</p>
        </Route>
      </Switch>
    </Router>
  }
}
import React, { Component } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { StoreProps } from '../interfaces/StoreProps';
import AuthStore from '../views/Auth/Auth.store';


export interface AuthGuardRouteProps extends RouteProps, StoreProps {
}

export default class AuthGuardRoute extends Component<AuthGuardRouteProps> {
  authStore: AuthStore = this.props.rootStore.authStore;

  render() {
    const isAuth = this.authStore.isAuth;
    return (
      isAuth ? <Route {...this.props}></Route> :
        <Redirect to={{ pathname: '/auth', state: { from: this.props.location } }} />
    )
  }
}
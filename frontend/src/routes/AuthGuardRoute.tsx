import React, { Component } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import userService from '../services/User.service';


export interface AuthGuardRouteProps extends RouteProps {
}

export default class AuthGuardRoute extends Component<AuthGuardRouteProps> {
  render() {
    const isAuth = userService.isAuth;
    return (
      isAuth ? <Route {...this.props}></Route> :
        <Redirect to={{ pathname: '/auth', state: { from: this.props.location } }} />
    )
  }
}
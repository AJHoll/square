import React, {Component} from 'react';
import {Redirect, Route, RouteProps} from 'react-router-dom';
import {StoreProps} from '../interfaces/StoreProps';
import AuthStore from '../views/Auth/Auth.store';
import UserService from "../services/User.service";


export interface AuthGuardRouteProps extends RouteProps, StoreProps {
    guardByRoles?: string[];
}

export default class AuthGuardRoute extends Component<AuthGuardRouteProps> {
    authStore: AuthStore = this.props.rootStore.authStore;
    userService: UserService = this.props.rootStore.rootService.userService;

    render() {
        const isLogin = this.authStore.isLogin;
        const {guardByRoles} = this.props;
        const isAuth = guardByRoles ? guardByRoles.findIndex((guardByRole) => this.userService.user?.roles.includes(guardByRole)) !== -1 ?? false : true;
        return (
            isLogin ?
                isAuth ? <Route {...this.props}></Route>
                    : <Redirect to={{pathname: '/', state: {from: this.props.location}}}/>
                : <Redirect to={{pathname: '/auth', state: {from: this.props.location}}}/>
        )
    }
}
import React from 'react';
import {BrowserRouter as Router, Redirect, Route, RouteComponentProps, Switch} from 'react-router-dom'
import AuthGuardRoute from './AuthGuardRoute';
import OAuthView from '../views/Auth/Auth.view';
import {StoreProps} from '../interfaces/StoreProps';
import DevsToast from '@ajholl/devsuikit/dist/DevsToast';
import OAdmRoleView from '../views/AdmRole/AdmRole.view';
import OAdmGroupView from '../views/AdmGroup/AdmGroup.view';
import OAdmUserView from "../views/AdmUser/AdmUser.view";
import OSqrRoleView from "../views/SqrRole/SqrRole.view";
import OSqrSquareView from "../views/SqrSquare/SqrSquare.view";
import OSqrTimerView from "../views/SqrTimer/SqrTimer.view";
import OMainMenuView from "../views/MainMenu/MainMenu.view";
import OMenuLayout from "../layouts/MenuLayout";
import OSqrManageCriteriaView from "../views/SqrManageCriteria/SqrManageCriteria.view";
import OSqrManageRateView from "../views/SqrManageRate/SqrManageRate.view";
import OProfileView from "../views/Profile/Profile.view";
import OHelpView from "../views/Help/Help.view";
import OQuestionAnswerView from "../views/QuestionAnswer/QuestionAnswer.view";

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
                        <Route exact
                               path="/auth"
                               render={(routeProps: RouteComponentProps) =>
                                   <OAuthView {...routeProps}
                                              rootStore={this.props.rootStore}
                                              title={this.getTitle('Авторизация')}
                                   />}
                        />
                        <AuthGuardRoute exact
                                        path="/profile"
                                        rootStore={this.props.rootStore}
                                        render={(routeProps: RouteComponentProps) =>
                                            <OMenuLayout {...routeProps}
                                                         rootStore={this.props.rootStore}
                                                         hideEnd={true}
                                                         title="Профиль">
                                                <OProfileView {...routeProps}
                                                              rootStore={this.props.rootStore}
                                                              title={this.getTitle('Профиль')}
                                                />
                                            </OMenuLayout>}
                        />
                        <AuthGuardRoute exact
                                        path="/help"
                                        rootStore={this.props.rootStore}
                                        render={(routeProps: RouteComponentProps) =>
                                            <OMenuLayout {...routeProps}
                                                         rootStore={this.props.rootStore}
                                                         hideEnd={true}
                                                         title="Справка по системе">
                                                <OHelpView {...routeProps}
                                                           rootStore={this.props.rootStore}
                                                           title={this.getTitle('Справка по системе')}
                                                />
                                            </OMenuLayout>}
                        />
                        <AuthGuardRoute exact
                                        path="/roles"
                                        rootStore={this.props.rootStore}
                                        guardByRoles={['admin']}
                                        render={(routeProps: RouteComponentProps) =>
                                            <OMenuLayout {...routeProps}
                                                         rootStore={this.props.rootStore}
                                                         title="Упралвение ролями">
                                                <OAdmRoleView {...routeProps}
                                                              rootStore={this.props.rootStore}
                                                              title={this.getTitle('Управление ролями')}
                                                />
                                            </OMenuLayout>}
                        />
                        <AuthGuardRoute exact
                                        path="/groups"
                                        guardByRoles={['admin']}
                                        rootStore={this.props.rootStore}
                                        render={(routeProps: RouteComponentProps) =>
                                            <OMenuLayout {...routeProps}
                                                         rootStore={this.props.rootStore}
                                                         title="Управление группами"
                                            >
                                                <OAdmGroupView {...routeProps}
                                                               rootStore={this.props.rootStore}
                                                               title={this.getTitle('Управление группами')}
                                                />
                                            </OMenuLayout>}
                        />
                        <AuthGuardRoute exact
                                        path="/users"
                                        guardByRoles={['admin', 'userManager']}
                                        rootStore={this.props.rootStore}
                                        render={(routeProps: RouteComponentProps) =>
                                            <OMenuLayout {...routeProps}
                                                         rootStore={this.props.rootStore}
                                                         title="Управление пользователями"
                                            >
                                                <OAdmUserView {...routeProps}
                                                              rootStore={this.props.rootStore}
                                                              title={this.getTitle('Управление пользователями')}
                                                />
                                            </OMenuLayout>}
                        />
                        <AuthGuardRoute exact
                                        path="/square-roles"
                                        guardByRoles={['admin']}
                                        rootStore={this.props.rootStore}
                                        render={(routeProps: RouteComponentProps) =>
                                            <OMenuLayout {...routeProps}
                                                         rootStore={this.props.rootStore}
                                                         title="Управление ролями на площадке"
                                            >
                                                <OSqrRoleView {...routeProps}
                                                              rootStore={this.props.rootStore}
                                                              title={this.getTitle('Управление ролями на площадке')}
                                                />
                                            </OMenuLayout>}
                        />
                        <AuthGuardRoute exact
                                        path="/squares"
                                        guardByRoles={['squareManage', 'timerManage', 'admin']}
                                        rootStore={this.props.rootStore}
                                        render={(routeProps: RouteComponentProps) =>
                                            <OMenuLayout {...routeProps}
                                                         rootStore={this.props.rootStore}
                                                         title="Управление площадками"
                                            >
                                                <OSqrSquareView {...routeProps}
                                                                rootStore={this.props.rootStore}
                                                                title={this.getTitle('Управление площадками')}
                                                />
                                            </OMenuLayout>}
                        />
                        <AuthGuardRoute exact
                                        path="/timers"
                                        guardByRoles={['timerViewer', 'admin']}
                                        rootStore={this.props.rootStore}
                                        render={(routeProps: RouteComponentProps) =>
                                            <OMenuLayout {...routeProps}
                                                         rootStore={this.props.rootStore}
                                                         title="Просмотр таймеров"
                                            >
                                                <OSqrTimerView {...routeProps}
                                                               rootStore={this.props.rootStore}
                                                               title={this.getTitle('Просмотр таймеров')}
                                                />
                                            </OMenuLayout>}
                        />
                        <AuthGuardRoute exact
                                        path="/manage-criteria"
                                        guardByRoles={['criteriaManager', 'admin']}
                                        rootStore={this.props.rootStore}
                                        render={(routeProps: RouteComponentProps) =>
                                            <OMenuLayout {...routeProps}
                                                         rootStore={this.props.rootStore}
                                                         title="Управление критериями"
                                            >
                                                <OSqrManageCriteriaView {...routeProps}
                                                                        rootStore={this.props.rootStore}
                                                                        title={this.getTitle('Управление критериями')}
                                                />
                                            </OMenuLayout>}
                        />
                        <AuthGuardRoute exact
                                        path="/manage-rate"
                                        guardByRoles={['rateManager', 'admin']}
                                        rootStore={this.props.rootStore}
                                        render={(routeProps: RouteComponentProps) =>
                                            <OMenuLayout {...routeProps}
                                                         rootStore={this.props.rootStore}
                                                         title="Заведение оценок"
                                            >
                                                <OSqrManageRateView {...routeProps}
                                                                    rootStore={this.props.rootStore}
                                                                    title={this.getTitle('Заведение оценок')}
                                                />
                                            </OMenuLayout>}
                        />
                        <AuthGuardRoute exact
                                        path="/question-answer"
                                        rootStore={this.props.rootStore}
                                        render={(routeProps: RouteComponentProps) =>
                                            <OMenuLayout {...routeProps}
                                                         rootStore={this.props.rootStore}
                                                         title="Вопросы и ответы"
                                            >
                                                <OQuestionAnswerView {...routeProps}
                                                                     rootStore={this.props.rootStore}
                                                                     title={this.getTitle('Вопросы и ответы')}
                                                />
                                            </OMenuLayout>}
                        />
                        <Route path="*">
                            <Redirect to="/"/>
                        </Route>
                    </Switch>
                </Router>
                <DevsToast ref={this.toastRef} appendTo="self"/>
            </>
        )
    }
}
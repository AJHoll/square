import React from 'react';
import { observer } from 'mobx-react';
import DevsPanel from '@ajholl/devsuikit/dist/DevsPanel';
import DevsInput from '@ajholl/devsuikit/dist/DevsInput';
import DevsPassword from '@ajholl/devsuikit/dist/DevsPassword';
import DevsButton from '@ajholl/devsuikit/dist/DevsButton';
import './Auth.view.scss'
import AuthStore from './Auth.store';
import { BaseViewProps } from '../../interfaces/BaseViewProps';

export interface AuthViewProps extends BaseViewProps {
}

export class AuthView extends React.Component<AuthViewProps> {
  authStore: AuthStore = this.props.rootStore.authStore;

  componentDidMount() {
    document.title = this.props.title;
  }

  render() {
    return (
      <div className="auth_view">
        <DevsPanel className="auth_view__card">
          <div className="auth_view__card_title">
            Авторизация
          </div>
          <div className="auth_view__card_content">
            <label className="auth_view__card_content-item">
              <span>Логин:</span>
              <DevsInput placeholder="Введите имя пользователя"
                         onChange={(event) => {
                           this.authStore.username = event.target.value;
                         }}
              />
            </label>
            <label className="auth_view__card_content-item">
              <span>Пароль:</span>
              <DevsPassword placeholder="Введите пароль"
                            onChange={(event) => {
                              this.authStore.password = event.target.value;
                            }}
              />
            </label>
          </div>
          <div className="auth_view__card_footer">
            <DevsButton template="filled"
                        color="primary"
                        title="Войти"
                        onClick={async () => this.authStore.auth()}
            />
          </div>
        </DevsPanel>
      </div>
    );
  }
}

const OAuthView = observer(AuthView);
export default OAuthView;
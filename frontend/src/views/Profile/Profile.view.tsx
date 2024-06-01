import './Profile.view.scss';
import React from "react";
import {BaseViewProps} from "../../interfaces/BaseViewProps";
import {observer} from "mobx-react";
import DevsPanel from "@ajholl/devsuikit/dist/DevsPanel";
import DevsForm from "@ajholl/devsuikit/dist/DevsForm";
import DevsFormItem from "@ajholl/devsuikit/dist/DevsFormItem";
import DevsInput from "@ajholl/devsuikit/dist/DevsInput";
import DevsPassword from "@ajholl/devsuikit/dist/DevsPassword";
import DevsButton from "@ajholl/devsuikit/dist/DevsButton";
import {SqrTimer} from "../SqrTimer/components/SqrTimer";
import ProfileStore from "./Profile.store";


interface ProfileViewProps extends BaseViewProps {
}

export class ProfileView extends React.Component<ProfileViewProps> {
    readonly profileStore: ProfileStore = this.props.rootStore.profileStore;

    async componentDidMount(): Promise<void> {
        document.title = this.props.title;
        await this.profileStore.init();
    }

    componentWillUnmount() {
        this.profileStore.dispatch();
    }

    render() {
        return <div className="profile">
            <div className="profile_content">
                <DevsPanel className="user_data">
                    {
                        this.profileStore.user?.id ?
                            <DevsForm labelflex={2}
                                      inputflex={5}
                            >
                                <DevsFormItem label="Логин">
                                    <DevsInput keyFilter="alphanum"
                                               disabled={true}
                                               value={this.profileStore.user?.name}
                                    />
                                </DevsFormItem>
                                <DevsFormItem label="ФИО">
                                    <DevsInput value={this.profileStore.user?.caption}
                                               disabled={this.profileStore.mode === 'view'}
                                               onChange={(event) =>
                                                   this.profileStore.setUserCaption(event.target.value)}
                                    />
                                </DevsFormItem>
                                <DevsFormItem label="Пароль">
                                    <DevsPassword value={this.profileStore.user?.password}
                                                  disabled={this.profileStore.mode === 'view'}
                                                  onChange={(event) =>
                                                      this.profileStore.setUserPassword(event.target.value)}
                                    />
                                </DevsFormItem>
                            </DevsForm> : <></>
                    }
                    <div className="user_data__change_footer">
                        {
                            this.profileStore.mode === 'view' ? <DevsButton template="filled"
                                                                            color="primary"
                                                                            icon="lni lni-pencil-alt"
                                                                            title="Изменить"
                                                                            disabled={!this.profileStore.user?.id}
                                                                            onClick={() => (this.profileStore.mode = 'edit')}
                            /> : <></>
                        }
                        {
                            this.profileStore.mode === 'edit' ? <DevsButton template="filled"
                                                                            color="success"
                                                                            icon="lni lni-save"
                                                                            title="Сохранить"
                                                                            disabled={!this.profileStore.user?.id}
                                                                            onClick={() => this.profileStore.changeUserCaptionAndPassword()}
                            /> : <></>
                        }
                    </div>
                </DevsPanel>
                {this.profileStore.timer?.id ?
                    <DevsPanel className="user_timer">
                        <SqrTimer caption={this.profileStore.timer?.caption}
                                  countLeft={this.profileStore.timer?.countLeft}
                                  timerState={this.profileStore.timer?.state?.key}
                        />
                    </DevsPanel>
                    : <></>}

            </div>
        </div>;
    }
}

const OProfileView = observer(ProfileView);
export default OProfileView;
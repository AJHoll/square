import React from "react";
import {BaseViewProps} from "../../interfaces/BaseViewProps";
import './SqrTimer.view.scss';
import {observer} from "mobx-react";
import DevsSelect from "@ajholl/devsuikit/dist/DevsSelect";
import {SqrTimer} from "./components/SqrTimer";
import {SqrTimerStore} from "./SqrTimer.store";

interface SqrTimerViewProps extends BaseViewProps {
}

export class SqrTimerView extends React.Component<SqrTimerViewProps> {
    readonly sqrTimerStore: SqrTimerStore = this.props.rootStore.sqrTimerStore;
    selectRef: React.RefObject<DevsSelect> = React.createRef();

    async componentDidMount(): Promise<void> {
        document.title = this.props.title;
        await this.sqrTimerStore.init(this.selectRef);
    }

    componentWillUnmount(): void {
        this.sqrTimerStore.dispatch();
    }

    render() {
        return <div className="sqr_timer_view">
            <div className="sqr_timer_view__content">
                <div className="timer_toolbar">
                    <DevsSelect ref={this.selectRef}
                                addonBefore={<span style={{paddingLeft: '10px', paddingRight: '10px'}}>Площадка</span>}
                                options={this.sqrTimerStore.squares}
                                value={this.sqrTimerStore.selectedSquare}
                                onlySelection={true}
                                onChange={(event) => this.sqrTimerStore.selectedSquare = event.value}
                    />
                </div>
                <div className="timer_content">
                    <div className="timer_content__main_timer">
                        <SqrTimer caption={this.sqrTimerStore.mainTimer?.caption}
                                  countLeft={this.sqrTimerStore.mainTimer?.countLeft}
                                  className={this.sqrTimerStore.mainTimerChangeClass}
                        />
                    </div>
                    <div className="timer_content__other_timers">
                        {
                            this.sqrTimerStore.otherTimers.map((otherTimer) => (
                                <SqrTimer key={otherTimer.id}
                                          caption={otherTimer.caption}
                                          countLeft={otherTimer.countLeft}
                                />))
                        }
                    </div>
                </div>
            </div>
        </div>;
    }
}

const OSqrTimerView = observer(SqrTimerView);
export default OSqrTimerView;
import './SqrTimer.scss';
import React from "react";
import {SqrTimerDto} from "../../../dtos/SqrTimer.dto";
import {SqrTimerState} from "../../../dtos/SqrTimerState";

interface SqrTimerProps {
    caption: SqrTimerDto['caption'],
    countLeft: SqrTimerDto['countLeft'],
    className?: string,
    timerState?: SqrTimerState,
}

export class SqrTimer extends React.Component<SqrTimerProps> {
    render() {
        const {caption, countLeft, className, timerState} = this.props;
        const formatCountLeft = [Math.floor((countLeft ?? 0) / 3600), Math.floor(((countLeft ?? 0) % 3600) / 60), (countLeft ?? 0) % 60]
            .map((val) => String(val).padStart(2, '0'))
            .join(':');
        let timerStateTitle;
        switch (timerState) {
            case "PAUSE": {
                timerStateTitle = 'приостановлен';
                break;
            }
            default: {
                break;
            }
        }
        return <div className={`sqr_timer ${className ?? ''}`}>
            <div className="sqr_timer__caption">{caption}</div>
            <div className="sqr_timer__countLeft">{formatCountLeft}</div>
            {timerStateTitle ? <div className="sqr_timer__state">{timerStateTitle}</div> : <></>}
        </div>;
    }
}
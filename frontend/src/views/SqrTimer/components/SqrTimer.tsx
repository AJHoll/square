import './SqrTimer.scss';
import React from "react";
import {SqrTimerDto} from "../../../dtos/SqrTimer.dto";

interface SqrTimerProps {
    caption: SqrTimerDto['caption'],
    countLeft: SqrTimerDto['countLeft'],
    className?: string,
}

export class SqrTimer extends React.Component<SqrTimerProps> {
    render() {
        const {caption, countLeft, className} = this.props;
        const formatCountLeft = [Math.floor((countLeft ?? 0) / 3600), Math.floor(((countLeft ?? 0) % 3600) / 60), (countLeft ?? 0) % 60]
            .map((val) => String(val).padStart(2, '0'))
            .join(':');
        return <div className={`sqr_timer ${className ?? ''}`}>
            <div className="sqr_timer__caption">{caption}</div>
            <div className="sqr_timer__countLeft">{formatCountLeft}</div>
        </div>;
    }
}
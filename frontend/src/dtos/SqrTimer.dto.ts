import {SqrSquareDto} from "./SqrSquare.dto";
import {SqrTeamDto} from "./SqrTeam.dto";
import {SqrTimerState} from "./SqrTimerState";

export interface SqrTimerDto {
    id?: number;
    squareId?: SqrSquareDto['id'],
    teamId?: SqrTeamDto['id'],
    caption?: string;
    count?: number;
    countLeft?: number;
    state?: { key: SqrTimerState, value: string };
    beginTime?: Date;
    pauseTime?: Date;
    continueTime?: Date;
    stopTime?: Date;
}
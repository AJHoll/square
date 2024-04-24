import {SqrSquareDto} from "./sqr-square.dto";
import {SqrTeamDto} from "./sqr-team.dto";

export interface SqrTimerDto {
    id?: number;
    squareId?: SqrSquareDto['id'],
    teamId?: SqrTeamDto['id'],
    caption?: string;
    count?: number;
    countLeft?: number;
    state?: { key: string, value: string };
    beginTime?: Date;
    pauseTime?: Date;
    continueTime?: Date;
    stopTime?: Date;
}
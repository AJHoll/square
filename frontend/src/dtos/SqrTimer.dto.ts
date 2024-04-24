import {SqrSquareDto} from "./SqrSquare.dto";
import {SqrTeamDto} from "./SqrTeam.dto";

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
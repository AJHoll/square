import {SelectOption} from "@ajholl/devsuikit";

export interface SqrSquareEvalGroupDto {
    id?: number;
    squareId?: number;
    code?: string;
    caption?: string;
    modules?: string;
    formModules?: SelectOption[];
}
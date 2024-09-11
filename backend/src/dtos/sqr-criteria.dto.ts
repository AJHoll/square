import {SqrSubcriteriaDto} from "./sqr-subcriteria.dto";

export interface SqrCriteriaDto {
    id: string;
    key: string;
    caption: string;
    maxMark: string;
    subcriterias: SqrSubcriteriaDto[];
    sumSubcriteriaMark?: number;
    module?: string;
}
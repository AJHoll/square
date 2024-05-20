import {SqrSubcriteriaDto} from "./sqr-subcriteria.dto";

export interface SqrCriteriaDto {
    id: string;
    key: string;
    caption: string;
    mark: string;
    subcriterias: SqrSubcriteriaDto[];
    sumSubcriteriaMark?: number;
    module?: string;
}
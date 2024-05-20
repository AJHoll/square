import {SqrAspectDto} from "./sqr-aspect.dto";

export interface SqrSubcriteriaDto {
    id: string;
    order: string;
    caption: string;
    aspects: SqrAspectDto[];
    module?: string;
}
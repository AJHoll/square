import {SqrAspectDto} from "./SqrAspect.dto";

export interface SqrSubcriteriaDto {
    id: string;
    order: string;
    caption: string;
    aspects: SqrAspectDto[];
    module?: string;
}
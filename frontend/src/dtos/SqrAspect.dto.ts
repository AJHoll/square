import {SqrAspectExtraDto} from "./SqrAspectExtra.dto";

export interface SqrAspectDto {
    id: string;
    type: 'B' | 'D' | 'J';
    caption: string;
    description?: string;
    sectionKey?: string;
    mark: string;
    extra?: SqrAspectExtraDto[];
}
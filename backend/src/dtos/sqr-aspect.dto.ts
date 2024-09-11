import {SqrAspectExtraDto} from "./sqr-aspect-extra.dto";

export interface SqrAspectDto {
    id: string;
    type: 'B' | 'D' | 'J' | 'Z';
    caption: string;
    description?: string;
    sectionKey?: string;
    maxMark: string;
    extra?: SqrAspectExtraDto[];
    module?: string;
    zedLink?: SqrAspectDto['id'];
    asssSection?: string;
    mark?: string;
}
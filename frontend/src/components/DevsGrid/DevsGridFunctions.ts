import {ValueFormatterFunc, ValueFormatterParams} from "ag-grid-community";

export const devsGridDateTimeFormatter: ValueFormatterFunc = <TData, TValue>(params: ValueFormatterParams<TData, TValue>): string => {
    if (!params.value) {
        return ''
    }
    try {
        return new Date(<string>params.value).toLocaleString();
    } catch (e) {
    }
    return 'Неверная дата';
}
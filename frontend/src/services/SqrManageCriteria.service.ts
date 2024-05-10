import RootService from "./Root.service";
import {makeAutoObservable} from "mobx";
import axios from "axios";
import {SqrSquareDto} from "../dtos/SqrSquare.dto";
import {SqrCriteriaDto} from "../dtos/SqrCriteria.dto";

export class SqrManageCriteriaService {
    private readonly rootService: RootService;
    private readonly _restPath: string;

    constructor(rootService: RootService) {
        this.rootService = rootService;
        this._restPath = `${this.rootService.restUrl}/manage-criteria`;
        makeAutoObservable(this);
    }

    async getCriterias(squareId: SqrSquareDto['id']): Promise<SqrCriteriaDto[]> {
        return (await axios.get<SqrCriteriaDto[]>(`${this._restPath}`, {params: {squareId}})).data;
    }

    async saveCriterias(squareId: SqrSquareDto['id'],
                        criterias: SqrCriteriaDto[]): Promise<void> {
        await axios.post<SqrCriteriaDto[]>(`${this._restPath}`, criterias, {params: {squareId}});
    }

    async uploadXlsx(squareId: SqrSquareDto['id'], file: File): Promise<SqrCriteriaDto[]> {
        const formData = new FormData();
        formData.append('file', file);
        return ((await axios.post<SqrCriteriaDto[]>(`${this._restPath}/upload-xlsx`, formData, {params: {squareId}}))?.data) ?? [];
    }

    async downloadXlsx(squareId: SqrSquareDto['id'], criterias: SqrCriteriaDto[]): Promise<ArrayBuffer> {
        return (await axios.post<ArrayBuffer>(`${this._restPath}/download-xlsx`, criterias, {
            params: {squareId},
            responseType: 'arraybuffer'
        }))?.data;
    }
}
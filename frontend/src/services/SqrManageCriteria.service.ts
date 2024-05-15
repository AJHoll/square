import RootService from "./Root.service";
import {makeAutoObservable} from "mobx";
import axios from "axios";
import {SqrSquareDto} from "../dtos/SqrSquare.dto";
import {SqrCriteriaDto} from "../dtos/SqrCriteria.dto";

export class SqrManageCriteriaService {
    private readonly rootService: RootService;

    get restPath(): string {
        return `${this.rootService.restUrl}/manage-criteria`;
    }

    constructor(rootService: RootService) {
        this.rootService = rootService;
        makeAutoObservable(this);
    }

    async getCriterias(squareId: SqrSquareDto['id']): Promise<SqrCriteriaDto[]> {
        return (await axios.get<SqrCriteriaDto[]>(`${this.restPath}`, {params: {squareId}})).data;
    }

    async saveCriterias(squareId: SqrSquareDto['id'],
                        criterias: SqrCriteriaDto[]): Promise<void> {
        await axios.post<SqrCriteriaDto[]>(`${this.restPath}`, criterias, {params: {squareId}});
    }

    async uploadXlsx(squareId: SqrSquareDto['id'], file: File): Promise<SqrCriteriaDto[]> {
        const formData = new FormData();
        formData.append('file', file);
        return ((await axios.post<SqrCriteriaDto[]>(`${this.restPath}/upload-xlsx`, formData, {params: {squareId}}))?.data) ?? [];
    }

    async downloadXlsx(squareId: SqrSquareDto['id'], criterias: SqrCriteriaDto[]): Promise<ArrayBuffer> {
        return (await axios.post<ArrayBuffer>(`${this.restPath}/download-xlsx`, criterias, {
            params: {squareId},
            responseType: 'arraybuffer'
        }))?.data;
    }
}
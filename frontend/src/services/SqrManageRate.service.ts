import RootService from "./Root.service";
import {makeAutoObservable} from "mobx";
import {SqrSquareDto} from "../dtos/SqrSquare.dto";
import {SqrSquareEvalGroupDto} from "../dtos/SqrSquareEvalGroup.dto";
import {SqrCriteriaDto} from "../dtos/SqrCriteria.dto";
import axios from "axios";
import {SqrTeamDto} from "../dtos/SqrTeam.dto";

export default class SqrManageRateService {
    private readonly rootService: RootService;

    get restPath(): string {
        return `${this.rootService.restUrl}/manage-rate`;
    }

    constructor(rootService: RootService) {
        this.rootService = rootService;
        makeAutoObservable(this);
    }

    async getAvailableModules(squareId: SqrSquareDto['id'], evalGroupId: SqrSquareEvalGroupDto['id']): Promise<string[]> {
        return (await axios.get<string[]>(`${this.restPath}/modules`, {params: {squareId, evalGroupId}})).data;
    }

    async getAvailableRates(squareId: SqrSquareDto['id'],
                            evalGroupId: SqrSquareEvalGroupDto['id'],
                            module: number,
                            teamId: SqrTeamDto['id']): Promise<SqrCriteriaDto[]> {
        return (await axios.get<SqrCriteriaDto[]>(`${this.restPath}`, {
            params: {squareId, evalGroupId, module, teamId}
        })).data;
    }

    async saveRates(squareId: SqrSquareDto['id'], teamId: SqrTeamDto['id'], rates: SqrCriteriaDto[]): Promise<void> {
        await axios.post<void>(`${this.restPath}`, rates, {params: {squareId, teamId}});
    }

    async downloadXlsx(squareId: SqrSquareDto['id'], teamId: SqrTeamDto['id'], module: number): Promise<ArrayBuffer> {
        return (await axios.post<ArrayBuffer>(`${this.restPath}/download-xlsx`, {}, {
            params: {squareId, teamId, module},
            responseType: 'arraybuffer'
        }))?.data;
    }
}
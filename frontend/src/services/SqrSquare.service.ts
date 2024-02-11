import RootService from "./Root.service";
import {makeAutoObservable} from "mobx";
import axios from "axios";
import {SqrSquareDto} from "../dtos/SqrSquare.dto";

export default class SqrSquareService {
    private readonly _rootService: RootService;
    private readonly _restPath: string;

    constructor(rootService: RootService) {
        this._rootService = rootService;
        this._restPath = `${rootService.restUrl}/sqr-square`;
        makeAutoObservable(this);
    }

    async getSquares(): Promise<SqrSquareDto[]> {
        return (await axios.get<SqrSquareDto[]>(`${this._restPath}`)).data;
    }

    async getSquare(id: SqrSquareDto['id']): Promise<SqrSquareDto> {
        return (await axios.get<SqrSquareDto>(`${this._restPath}/${id}`)).data;
    }

    async createSquare(sqrSquare: SqrSquareDto): Promise<SqrSquareDto> {
        return (await axios.post<SqrSquareDto>(`${this._restPath}`, sqrSquare)).data;
    }

    async editSquare(id: SqrSquareDto['id'], sqrSquare: SqrSquareDto): Promise<SqrSquareDto> {
        return (await axios.put<SqrSquareDto>(`${this._restPath}/${id}`, sqrSquare)).data;
    }

    async deleteSquares(ids: SqrSquareDto['id'][]): Promise<void> {
        await axios.delete(`${this._restPath}/${ids.join(',')}`);
    }
}
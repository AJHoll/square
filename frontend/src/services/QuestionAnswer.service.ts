import RootService from "./Root.service";
import {makeAutoObservable} from "mobx";
import axios from "axios";
import {SqrSquareDto} from "../dtos/SqrSquare.dto";
import {QuestionDto} from "../dtos/Question.dto";

export default class QuestionAnswerService {
    private readonly rootService: RootService;

    get restPath(): string {
        return `${this.rootService.restUrl}/question-answer`;
    }

    constructor(rootService: RootService) {
        this.rootService = rootService;
        makeAutoObservable(this);
    }

    async getQuestions(squareId: SqrSquareDto['id']): Promise<QuestionDto[]> {
        return (await axios.get<QuestionDto[]>(`${this.restPath}`, {params: {squareId}})).data ?? [];
    }

    async addQuestion(squareId: SqrSquareDto['id'], question: QuestionDto['question']): Promise<void> {
        await axios.post<void>(`${this.restPath}`, {question: question}, {params: {squareId}});
    }
}
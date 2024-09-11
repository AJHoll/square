import RootStore from "../Root.store";
import QuestionAnswerService from "../../services/QuestionAnswer.service";
import SqrSquareService from "../../services/SqrSquare.service";
import {makeAutoObservable} from "mobx";
import {SelectOption} from "@ajholl/devsuikit";
import DevsSelect from "@ajholl/devsuikit/dist/DevsSelect";
import React from "react";
import {QuestionDto} from "../../dtos/Question.dto";
import {SqrSquareDto} from "../../dtos/SqrSquare.dto";

export default class QuestionAnswerStore {
    private readonly _rootStore: RootStore;
    private readonly _questionAnswerService: QuestionAnswerService;
    private readonly _sqrSquareService: SqrSquareService

    private _selectSquareRef: React.RefObject<DevsSelect> | undefined;

    private _squares: SelectOption[] = [];
    get squares(): SelectOption[] {
        return this._squares;
    }

    set squares(value: SelectOption[]) {
        this._squares = value;
    }

    private _selectedSquare: SelectOption | undefined;
    get selectedSquare(): SelectOption | undefined {
        return this._selectedSquare;
    }

    set selectedSquare(value: SelectOption | undefined) {
        this._selectedSquare = value;
        if (this._selectSquareRef) {
            this._selectSquareRef.current?.setState({cValue: value});
        }
        this.reloadQuestions().then();
    }

    private _mode: 'view' | 'edit' = 'view';
    get mode(): "view" | "edit" {
        return this._mode;
    }

    set mode(value: "view" | "edit") {
        this._mode = value;
    }


    private _questions: QuestionDto[] = [];
    get questions(): QuestionDto[] {
        return this._questions;
    }

    set questions(value: QuestionDto[]) {
        this._questions = value;
    }

    private _addQuestionText: string = '';
    get addQuestionText(): string {
        return this._addQuestionText;
    }

    set addQuestionText(value: string) {
        this._addQuestionText = value;
    }

    constructor(rootStore: RootStore,
                questionAnswerService: QuestionAnswerService,
                sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._questionAnswerService = questionAnswerService;
        this._sqrSquareService = sqrSquareService;
        makeAutoObservable(this);
    }

    async init(selectRef: React.RefObject<DevsSelect>): Promise<void> {
        this._selectSquareRef = selectRef;
        this.squares = (await this._sqrSquareService.getSquares()).map((square) => ({
            label: square.caption!,
            value: square.id!
        }));
        this.selectedSquare = this.squares[0];
        await this.reloadQuestions();
    }

    async reloadQuestions(): Promise<void> {
        this.questions = await this._questionAnswerService.getQuestions(this.selectedSquare?.value as SqrSquareDto['id']);
    }

    async addQuestion(): Promise<void> {
        await this._questionAnswerService.addQuestion(this.selectedSquare?.value as SqrSquareDto['id'], this._addQuestionText);
        this.addQuestionText = '';
        await this.reloadQuestions();
        this.mode = 'view';
    }
}
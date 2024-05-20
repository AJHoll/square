import RootStore from "../Root.store";
import SqrSquareService from "../../services/SqrSquare.service";
import {SelectOption} from "@ajholl/devsuikit";
import {makeAutoObservable} from "mobx";
import SqrManageRateService from "../../services/SqrManageRate.service";
import React from "react";
import DevsSelect from "@ajholl/devsuikit/dist/DevsSelect";
import {SqrCriteriaDto} from "../../dtos/SqrCriteria.dto";
import {SqrSquareDto} from "../../dtos/SqrSquare.dto";
import {SqrSquareEvalGroupDto} from "../../dtos/SqrSquareEvalGroup.dto";
import {SqrSubcriteriaDto} from "../../dtos/SqrSubcriteria.dto";
import {SqrAspectDto} from "../../dtos/SqrAspect.dto";
import {SqrAspectExtraDto} from "../../dtos/SqrAspectExtra.dto";
import {SqrTeamDto} from "../../dtos/SqrTeam.dto";
import {saveAs} from "file-saver";

export default class SqrManageRateStore {
    private readonly _rootStore: RootStore;
    private readonly _sqrManageRateService: SqrManageRateService;
    private readonly _sqrSquareService: SqrSquareService;

    private _sqareSelectRef: React.RefObject<DevsSelect> | undefined;
    private _evalGroupSelectRef: React.RefObject<DevsSelect> | undefined;
    private _moduleSelectRef: React.RefObject<DevsSelect> | undefined;
    private _teamSelectRef: React.RefObject<DevsSelect> | undefined;

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
        if (this._sqareSelectRef) {
            this._sqareSelectRef.current?.setState({cValue: value});
        }
        this._selectedSquare = value;
        this.reloadEvalGroups().then();
    }

    private _evalGroups: SelectOption[] = [];
    get evalGroups(): SelectOption[] {
        return this._evalGroups;
    }

    set evalGroups(value: SelectOption[]) {
        this._evalGroups = value;
    }

    private _selectedEvalGroup: SelectOption | undefined;
    get selectedEvalGroup(): SelectOption | undefined {
        return this._selectedEvalGroup;
    }

    set selectedEvalGroup(value: SelectOption | undefined) {
        if (this._evalGroupSelectRef) {
            this._evalGroupSelectRef.current?.setState({cValue: value});
        }
        this._selectedEvalGroup = value;
        this.reloadModules().then();
    }


    private _modules: SelectOption[] = [];
    get modules(): SelectOption[] {
        return this._modules;
    }

    set modules(value: SelectOption[]) {
        this._modules = value;
    }

    private _selectedModule: SelectOption | undefined;
    get selectedModule(): SelectOption | undefined {
        return this._selectedModule;
    }

    set selectedModule(value: SelectOption | undefined) {
        if (this._moduleSelectRef) {
            this._moduleSelectRef.current?.setState({cValue: value});
        }
        this._selectedModule = value;
        this.reloadTeams().then();
    }

    private _teams: SelectOption[] = [];
    get teams(): SelectOption[] {
        return this._teams;
    }

    set teams(value: SelectOption[]) {
        this._teams = value;
    }

    private _selectedTeam: SelectOption | undefined;
    get selectedTeam(): SelectOption | undefined {
        return this._selectedTeam;
    }

    set selectedTeam(value: SelectOption | undefined) {
        if (this._teamSelectRef) {
            this._teamSelectRef.current?.setState({cValue: value});
        }
        this._selectedTeam = value;
        this.reloadRates().then();
    }

    private _rates: SqrCriteriaDto[] = [];
    get rates(): SqrCriteriaDto[] {
        return this._rates;
    }

    set rates(value: SqrCriteriaDto[]) {
        this._rates = value;
    }

    constructor(rootStore: RootStore,
                sqrManageRateService: SqrManageRateService,
                sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrManageRateService = sqrManageRateService;
        this._sqrSquareService = sqrSquareService;
        makeAutoObservable(this);
    }

    async init(sqareSelectRef: React.RefObject<DevsSelect>,
               evalGroupSelectRef: React.RefObject<DevsSelect>,
               moduleSelectRef: React.RefObject<DevsSelect>,
               teamSelectRef: React.RefObject<DevsSelect>): Promise<void> {
        this._sqareSelectRef = sqareSelectRef;
        this._evalGroupSelectRef = evalGroupSelectRef;
        this._moduleSelectRef = moduleSelectRef;
        this._teamSelectRef = teamSelectRef;
        this.squares = (await this._sqrSquareService.getSquares()).map((square) => ({
            label: square.caption!,
            value: square.id!
        }));
        this.selectedSquare = this._squares[0];
        await this.reloadEvalGroups();
    }

    async reloadEvalGroups(): Promise<void> {
        if (this._selectedSquare) {
            this.evalGroups = (await this._sqrSquareService.getSquareEvalGroups(this._selectedSquare.value as SqrSquareDto['id']))
                .map((evalGroup) => ({
                    label: evalGroup.caption!,
                    value: evalGroup.id!
                }));
            this.selectedEvalGroup = this._evalGroups[0];
        }
    }

    async reloadModules(): Promise<void> {
        if (this._selectedSquare && this._selectedEvalGroup) {
            this.modules = (await this._sqrManageRateService.getAvailableModules(this._selectedSquare.value as SqrSquareDto['id'],
                this._selectedEvalGroup.value as SqrSquareEvalGroupDto['id']))
                .map((module) => ({
                    label: module,
                    value: module
                }));
            this.selectedModule = this._modules[0];
        }
    }

    async reloadTeams(): Promise<void> {
        this.teams = (await this._sqrSquareService.getSquareTeams(this._selectedSquare?.value as SqrSquareDto['id'])).map((team) => ({
            label: team.caption!,
            value: team.id!,
        }));
        this.selectedTeam = this._teams[0];
    }

    async reloadRates(): Promise<void> {
        if (!this._selectedSquare?.value || !this._selectedEvalGroup?.value || !this._selectedModule?.value) {
            this.rates = [];
            return;
        }
        this.rates = [];
        this.rates = (await this._sqrManageRateService.getAvailableRates(+this._selectedSquare!.value,
            +this._selectedEvalGroup!.value,
            +this._selectedModule!.value!,
            +this._selectedTeam?.value!));
    }

    setAspectExtraBinaryMark(criteriaId: SqrCriteriaDto['id'],
                             subcriteriaId: SqrSubcriteriaDto['id'],
                             aspectId: SqrAspectDto['id'],
                             value: boolean): void {
        const criteria = this._rates.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                const aspect = subcriteria.aspects.find((aspect) => aspect.id === aspectId);
                if (aspect !== undefined) {
                    aspect.mark = value ? '1' : '0';
                }
            }
        }
    }

    setAspectExtraDiscreteMark(criteriaId: SqrCriteriaDto['id'],
                               subcriteriaId: SqrSubcriteriaDto['id'],
                               aspectId: SqrAspectDto['id'],
                               extraId: SqrAspectExtraDto['id'],
                               value: string): void {
        const criteria = this._rates.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                const aspect = subcriteria.aspects.find((aspect) => aspect.id === aspectId);
                if (aspect !== undefined) {
                    const extra = aspect.extra?.find((extra) => extra.id === extraId);
                    if (extra !== undefined) {
                        extra.mark = value;
                    }
                }
            }
        }
    }

    setAspectExtraJudgeMark(criteriaId: SqrCriteriaDto['id'],
                            subcriteriaId: SqrSubcriteriaDto['id'],
                            aspectId: SqrAspectDto['id'],
                            extraId: SqrAspectExtraDto['id'],
                            index: number,
                            checked: boolean): void {
        const criteria = this._rates.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                const aspect = subcriteria.aspects.find((aspect) => aspect.id === aspectId);
                if (aspect !== undefined) {
                    const extra = aspect.extra?.find((extra) => extra.id === extraId);
                    if (extra !== undefined) {
                        if (checked) {
                            const indexes = extra.mark?.split('') ?? [];
                            if (!indexes.includes(String(index))) {
                                indexes.push(String(index));
                            }
                            aspect.extra?.forEach((anotherExtra) => {
                                if (anotherExtra.id !== extra.id) {
                                    let anotherIndexes = (anotherExtra.mark?.split('') ?? []).filter((anotherIndex) => anotherIndex !== String(index));
                                    anotherExtra.mark = anotherIndexes.join('');
                                }
                            });
                            extra.mark = indexes.join('');
                        }
                    }
                }
            }
        }
    }

    async saveRates(): Promise<void> {
        await this._sqrManageRateService.saveRates(this._selectedSquare?.value as SqrSquareDto['id'],
            this._selectedTeam?.value as SqrTeamDto['id'], this._rates);
        this._rootStore.message.success('Данные успешно сохранены');
    }

    async downloadXLSX(): Promise<void> {
        const fileArrayBuffer = await this._sqrManageRateService.downloadXlsx(this._selectedSquare?.value as SqrSquareDto['id'],
            this._selectedTeam?.value as SqrTeamDto['id'], +this._selectedModule?.value!);
        if (fileArrayBuffer) {
            saveAs(new Blob([fileArrayBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
            }), `${this._selectedTeam?.label}__модуль_${this._selectedModule?.value}`);
        }
    }
}
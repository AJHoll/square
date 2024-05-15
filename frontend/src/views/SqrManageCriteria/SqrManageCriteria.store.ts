import RootStore from "../Root.store";
import {makeAutoObservable} from "mobx";
import {SqrManageCriteriaService} from "../../services/SqrManageCriteria.service";
import React from "react";
import DevsSelect from "@ajholl/devsuikit/dist/DevsSelect";
import SqrSquareService from "../../services/SqrSquare.service";
import {SelectOption} from "@ajholl/devsuikit";
import {SqrCriteriaDto} from "../../dtos/SqrCriteria.dto";
import {v4 as uuid} from 'uuid';
import {SqrSubcriteriaDto} from "../../dtos/SqrSubcriteria.dto";
import {SqrAspectDto} from "../../dtos/SqrAspect.dto";
import {SqrAspectExtraDto} from "../../dtos/SqrAspectExtra.dto";
import {SqrSquareDto} from "../../dtos/SqrSquare.dto";
import {saveAs} from 'file-saver';

export class SqrManageCriteriaStore {
    private readonly _rootStore: RootStore;
    private readonly _sqrManageCriteriaService: SqrManageCriteriaService;
    private readonly _sqrSquareService: SqrSquareService;

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
        if (this._selectSquareRef) {
            this._selectSquareRef.current?.setState({cValue: value});
        }
        this._selectedSquare = value;
        this.reloadCriterias().then();
    }

    private _criterias: SqrCriteriaDto[] = [];
    get criterias(): SqrCriteriaDto[] {
        return this._criterias;
    }

    set criterias(value: SqrCriteriaDto[]) {
        this._criterias = value;
        this._criterias.forEach((criteria) => this.recalcSumSubcriteriaMark(criteria));
    }

    private readonly _aspectTypes: SelectOption[] = [
        {
            label: 'Бинарный',
            value: 'B',
        },
        {
            label: 'Дискретный',
            value: 'D',
        },
        {
            label: 'Судейский',
            value: 'J',
        },
    ];

    get aspectTypes(): SelectOption[] {
        return this._aspectTypes;
    }

    get alphabet(): string {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }

    constructor(rootStore: RootStore,
                sqrManageCriteriaService: SqrManageCriteriaService,
                sqrSquareService: SqrSquareService) {
        this._rootStore = rootStore;
        this._sqrManageCriteriaService = sqrManageCriteriaService;
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
        await this.reloadCriterias();
    }

    async reloadCriterias(): Promise<void> {
        this.criterias = (await this._sqrManageCriteriaService.getCriterias(this._selectedSquare?.value as SqrSquareDto['id'])) ?? [];
    }

    addCriteria(): void {
        let criteriaKey = [...this._criterias].sort((a, b) =>
            this.alphabet.lastIndexOf(b.key) - this.alphabet.lastIndexOf(a.key))[0]?.key;
        criteriaKey = this.alphabet.charAt(this.alphabet.lastIndexOf(criteriaKey) + 1);
        this._criterias = [...this._criterias, {
            id: uuid(),
            key: criteriaKey,
            caption: '',
            mark: '0',
            subcriterias: []
        }]
    }

    async saveCriterias(): Promise<void> {
        await this._sqrManageCriteriaService.saveCriterias(this._selectedSquare?.value as SqrSquareDto['id'], this._criterias)
    }

    async clearCriterias(): Promise<void> {
        this.criterias = [];
    }

    setCriteriaKey(criteriaId: SqrCriteriaDto['id'],
                   criteriaKey: SqrCriteriaDto['key']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            criteria.key = criteriaKey;
        }
    }

    setCriteriaCaption(criteriaId: SqrCriteriaDto['id'],
                       criteriaCaption: SqrCriteriaDto['caption']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            criteria.caption = criteriaCaption;
        }
    }

    setCriteriaMark(criteriaId: SqrCriteriaDto['id'],
                    criteriaMark: SqrCriteriaDto['mark']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            criteria.mark = criteriaMark;
        }
    }

    removeCriteria(criteriaId: SqrCriteriaDto['id']): void {
        this.criterias = this._criterias.filter((criteria) => criteria.id !== criteriaId);
    }

    addSubcriteria(criteriaId: SqrCriteriaDto['id']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        const order = [...criteria!.subcriterias].sort((a, b) => +(b?.order ?? 0) - +(a?.order ?? 0))[0]?.order;
        criteria!.subcriterias = [...criteria!.subcriterias, {
            id: uuid(),
            caption: '',
            order: String(+(order ?? '0') + 1),
            aspects: []
        }]
    }

    setSubcriteriaOrder(criteriaId: SqrCriteriaDto['id'],
                        subcriteriaId: SqrSubcriteriaDto['id'],
                        subcriteriaOrder: SqrSubcriteriaDto['order']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                subcriteria.order = subcriteriaOrder;
                if (subcriteriaOrder !== undefined) {
                    criteria.subcriterias.sort((a, b) => +a.order - +b.order);
                }
            }
        }
    }

    setSubcriteriaCaption(criteriaId: SqrCriteriaDto['id'],
                          subcriteriaId: SqrSubcriteriaDto['id'],
                          subcriteriaCaption: SqrSubcriteriaDto['caption']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                subcriteria.caption = subcriteriaCaption;
            }
        }
    }

    removeSubcriteria(criteriaId: SqrCriteriaDto['id'],
                      subcriteriaId: SqrSubcriteriaDto['id']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            criteria.subcriterias = criteria.subcriterias.filter((subcriteria) => subcriteria.id !== subcriteriaId);
            this.recalcSumSubcriteriaMark(criteria);
        }
    }

    addAspect(criteriaId: SqrCriteriaDto['id'],
              subcriteriaId: SqrSubcriteriaDto['id']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                subcriteria.aspects.push({
                    id: uuid(),
                    type: 'B',
                    caption: '',
                    description: '',
                    mark: '',
                    extra: []
                });
            }
        }
    }

    setAspectType(criteriaId: SqrCriteriaDto['id'],
                  subcriteriaId: SqrSubcriteriaDto['id'],
                  aspectId: SqrAspectDto['id'],
                  aspectType: SqrAspectDto['type']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                const aspect = subcriteria.aspects.find((aspect) => aspect.id === aspectId);
                if (aspect !== undefined) {
                    if (aspect.type !== aspectType) {
                        aspect.type = aspectType;
                        if (aspect.type === 'J') {
                            aspect.extra = [
                                {id: uuid(), description: '', mark: '0'},
                                {id: uuid(), description: '', mark: '1'},
                                {id: uuid(), description: '', mark: '2'},
                                {id: uuid(), description: '', mark: '3'},
                            ];
                        }
                        if (aspect.type === 'D') {
                            aspect.extra = [
                                {id: uuid(), description: '', mark: ''},
                            ];
                        }
                        if (aspect.type === 'B') {
                            aspect.extra = undefined;
                        }
                    }
                }
            }
        }
    }

    setAspectCaption(criteriaId: SqrCriteriaDto['id'],
                     subcriteriaId: SqrSubcriteriaDto['id'],
                     aspectId: SqrAspectDto['id'],
                     aspectCaption: SqrAspectDto['caption']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                const aspect = subcriteria.aspects.find((aspect) => aspect.id === aspectId);
                if (aspect !== undefined) {
                    aspect.caption = aspectCaption;
                }
            }
        }
    }

    setAspectDescription(criteriaId: SqrCriteriaDto['id'],
                         subcriteriaId: SqrSubcriteriaDto['id'],
                         aspectId: SqrAspectDto['id'],
                         aspectDescription: SqrAspectDto['description']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                const aspect = subcriteria.aspects.find((aspect) => aspect.id === aspectId);
                if (aspect !== undefined) {
                    aspect.description = aspectDescription;
                }
            }
        }
    }

    setAspectMark(criteriaId: SqrCriteriaDto['id'],
                  subcriteriaId: SqrSubcriteriaDto['id'],
                  aspectId: SqrAspectDto['id'],
                  aspectMark: SqrAspectDto['mark']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                const aspect = subcriteria.aspects.find((aspect) => aspect.id === aspectId);
                if (aspect !== undefined) {
                    aspect.mark = aspectMark;
                    this.recalcSumSubcriteriaMark(criteria);
                }
            }
        }
    }

    removeAspect(criteriaId: SqrCriteriaDto['id'],
                 subcriteriaId: SqrSubcriteriaDto['id'],
                 aspectId: SqrAspectDto['id']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                subcriteria.aspects = subcriteria.aspects.filter((aspect) => aspect.id !== aspectId);
                this.recalcSumSubcriteriaMark(criteria);
            }
        }
    }

    setAspectExtraDescription(criteriaId: SqrCriteriaDto['id'],
                              subcriteriaId: SqrSubcriteriaDto['id'],
                              aspectId: SqrAspectDto['id'],
                              aspectExtraId: SqrAspectExtraDto['id'],
                              aspectExtraDescription: SqrAspectExtraDto['description']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                const aspect = subcriteria.aspects.find((aspect) => aspect.id === aspectId);
                if (aspect !== undefined) {
                    const extra = aspect.extra?.find((extra) => extra.id === aspectExtraId);
                    if (extra !== undefined) {
                        extra.description = aspectExtraDescription;
                    }
                }
            }
        }
    }

    setAspectExtraMark(criteriaId: SqrCriteriaDto['id'],
                       subcriteriaId: SqrSubcriteriaDto['id'],
                       aspectId: SqrAspectDto['id'],
                       aspectExtraId: SqrAspectExtraDto['id'],
                       aspectExtraMark: SqrAspectExtraDto['mark']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                const aspect = subcriteria.aspects.find((aspect) => aspect.id === aspectId);
                if (aspect !== undefined) {
                    const extra = aspect.extra?.find((extra) => extra.id === aspectExtraId);
                    if (extra !== undefined) {
                        extra.mark = aspectExtraMark;
                    }
                }
            }
        }
    }

    removeAspectExtra(criteriaId: SqrCriteriaDto['id'],
                      subcriteriaId: SqrSubcriteriaDto['id'],
                      aspectId: SqrAspectDto['id'],
                      aspectExtraId: SqrAspectExtraDto['id']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                const aspect = subcriteria.aspects.find((aspect) => aspect.id === aspectId);
                if (aspect !== undefined) {
                    aspect.extra = aspect.extra?.filter((extra) => extra.id !== aspectExtraId);
                }
            }
        }
    }

    addAspextExtraDiscrete(criteriaId: SqrCriteriaDto['id'],
                           subcriteriaId: SqrSubcriteriaDto['id'],
                           aspectId: SqrAspectDto['id']): void {
        const criteria = this._criterias.find((criteria) => criteria.id === criteriaId);
        if (criteria !== undefined) {
            const subcriteria = criteria.subcriterias.find((subcriteria) => subcriteria.id === subcriteriaId);
            if (subcriteria !== undefined) {
                const aspect = subcriteria.aspects.find((aspect) => aspect.id === aspectId);
                if (aspect !== undefined) {
                    aspect.extra = [...(aspect.extra ?? []), {
                        id: uuid(), description: '', mark: '',
                    }]
                }
            }
        }
    }

    async uploadFromXLSX(): Promise<void> {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                multiple: false,
                types: [{
                    description: 'Файлы .xlsx',
                    accept: {
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
                    }
                }]
            });
            const file = await fileHandle.getFile();
            this.criterias = await this._sqrManageCriteriaService.uploadXlsx(this._selectedSquare?.value as SqrSquareDto['id'],
                file);
        } catch (e) {
            console.log(e);
        }
    }

    async downloadXLSX(): Promise<void> {
        const fileArrayBuffer = await this._sqrManageCriteriaService.downloadXlsx(this._selectedSquare?.value as SqrSquareDto['id'], this._criterias);
        if (fileArrayBuffer) {
            saveAs(new Blob([fileArrayBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
            }));
        }
    }

    recalcSumSubcriteriaMark(criteria: SqrCriteriaDto): void {
        criteria.sumSubcriteriaMark = criteria.subcriterias.reduce((sumCriteria, subcriteria) => {
            return sumCriteria + subcriteria.aspects.reduce((sumAspect, aspect) => {
                return sumAspect + +aspect.mark;
            }, 0);
        }, 0);
    }
}
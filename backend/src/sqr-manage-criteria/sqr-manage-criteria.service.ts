import {Injectable, StreamableFile} from "@nestjs/common";
import {DatabaseService} from "../services/database.service";
import {SqrSquareDto} from "../dtos/sqr-square.dto";
import {SqrCriteriaDto} from "../dtos/sqr-criteria.dto";
import {JsonArray} from "@prisma/client/runtime/library";
import {v4 as uuid} from 'uuid';
import {SqrSubcriteriaDto} from "../dtos/sqr-subcriteria.dto";
import {SqrAspectDto} from "../dtos/sqr-aspect.dto";
import {Style, Workbook} from 'exceljs';
import * as path from 'path';
import {createReadStream} from 'fs';
import * as process from "process";
import {SqrSquareService} from "../sqr-square/sqr-square.service";

@Injectable()
export class SqrManageCriteriaService {
    constructor(private databaseService: DatabaseService,
                private sqrSquareService: SqrSquareService) {
    }

    async getCriterias(squareId: SqrSquareDto['id']): Promise<SqrCriteriaDto[]> {
        const dbResult = await this.databaseService.sqr_criteria.findFirst({
            where: {square_id: squareId}
        })
        return (dbResult?.criterias ?? []) as unknown as SqrCriteriaDto[];
    }

    async createRates(squareId: SqrSquareDto['id']): Promise<void> {
        const criterias = ((await this.databaseService.sqr_criteria.findFirst({
            where: {square_id: squareId}
        })).criterias ?? []) as unknown as SqrCriteriaDto[];
        const rates = criterias.map((criteria) => ({
            ...criteria,
            mark: undefined,
            sumSubcriteriaMark: undefined,
            subcriterias: criteria.subcriterias.map((subcriteria) => ({
                ...subcriteria,
                aspects: subcriteria.aspects.map((aspect) => ({
                    ...aspect,
                    mark: undefined,
                    extra: aspect.extra?.map((extra) => ({
                        ...extra,
                        order: aspect.type === 'J' ? extra.mark : undefined,
                        mark: undefined,
                    }))
                }))
            }))
        }));
        await this.databaseService.sqr_square_team.updateMany({
            where: {square_id: squareId}, data: {
                rates: rates as unknown as JsonArray
            }
        })
    }

    async saveCriterias(squareId: SqrSquareDto['id'],
                        criterias: SqrCriteriaDto[]): Promise<void> {
        const sqrCriteria = await this.databaseService.sqr_criteria.findFirst({
            where: {square_id: squareId}
        });
        if (sqrCriteria?.id) {
            await this.databaseService.sqr_criteria.update({
                where: {id: sqrCriteria.id},
                data: {
                    criterias: criterias as unknown as JsonArray
                }
            })
        } else {
            await this.databaseService.sqr_criteria.create({
                data: {
                    square_id: squareId,
                    criterias: criterias as unknown as JsonArray
                }
            });
        }
    }

    async loadFromXlsx(squareId: SqrSquareDto['id'],
                       file: Express.Multer.File): Promise<SqrCriteriaDto[]> {
        const data: SqrCriteriaDto[] = [];
        if (squareId && file) {
            const workbook = new Workbook();
            await workbook.xlsx.load(file.buffer);
            const sheet = workbook.getWorksheet(1);
            sheet?.getRows(4, 8)?.forEach((row) => {
                if (row.hasValues) {
                    data.push({
                        id: uuid(),
                        key: row.getCell('C').text,
                        caption: row.getCell('E').text,
                        mark: row.getCell('F').text,
                        subcriterias: [],
                    });
                }
            });
            data.forEach((skill) => {
                sheet.eachRow((row, rowNumber) => {
                    if (row.hasValues) {
                        if (row.getCell('A').text.indexOf(skill.key) === 0) {
                            const newSubcriteria: SqrSubcriteriaDto = {
                                id: uuid(),
                                order: row.getCell('A').text.replaceAll(skill.key, ''),
                                caption: row.getCell('B').text,
                                aspects: [],
                            };
                            let aspectsMaxRowNum = rowNumber + 1;
                            while (sheet.getRow(aspectsMaxRowNum).getCell('A').text.length === 0 && aspectsMaxRowNum < sheet.rowCount) {
                                aspectsMaxRowNum++;
                            }
                            sheet.getRows(rowNumber + 1, aspectsMaxRowNum - (rowNumber + 1))?.forEach((aspectRow) => {
                                if (aspectRow.hasValues) {
                                    if (['B', 'D', 'J', 'Z'].indexOf(aspectRow.getCell('C').text) !== -1) {
                                        const newAspect: SqrAspectDto = {
                                            id: uuid(),
                                            type: aspectRow.getCell('C').text as 'B' | 'J' | 'D' | 'Z',
                                            caption: aspectRow.getCell('E').text,
                                            description: aspectRow.getCell('G').text,
                                            mark: aspectRow.getCell('J').text,
                                            sectionKey: aspectRow.getCell('I').text,
                                            extra: [],
                                            zedLink: aspectRow.getCell('D').text,
                                        };
                                        let extraMaxRowNum = aspectRow.number + 1;
                                        while (sheet.getRow(extraMaxRowNum).getCell('E').text.length === 0 && extraMaxRowNum < sheet.rowCount) {
                                            extraMaxRowNum++;
                                        }
                                        if (extraMaxRowNum !== sheet.rowCount) {
                                            extraMaxRowNum--;
                                        }
                                        sheet.getRows(aspectRow.number + 1, extraMaxRowNum - aspectRow.number)?.forEach((extraRow) => {
                                            if (extraRow.hasValues) {
                                                if (newAspect.type === 'D'
                                                    && extraRow.getCell('G').text.length > 0) {
                                                    newAspect.extra.push({
                                                        id: uuid(),
                                                        description: extraRow.getCell('G').text,
                                                        mark: extraRow.getCell('J').text,
                                                    });
                                                } else if (newAspect.type === 'J'
                                                    && extraRow.getCell('G').text.length > 0
                                                    && ['0', '1', '2', '3'].indexOf(extraRow.getCell('F').text) !== -1) {
                                                    newAspect.extra.push({
                                                        id: uuid(),
                                                        description: extraRow.getCell('G').text,
                                                        mark: extraRow.getCell('F').text,
                                                    });
                                                }
                                            }
                                        });
                                        newSubcriteria.aspects.push(newAspect);
                                    }
                                }
                            });
                            skill.subcriterias.push(newSubcriteria);
                        }
                    }
                });
            });
        }
        this.makeZedLinkFromIndex(data);
        return data;
    }

    makeZedLinkFromIndex(data: SqrCriteriaDto[]): void {
        const zedLinkMap: { [key: string]: string } = {};
        for (const criteria of data) {
            for (const subcriteria of criteria.subcriterias) {
                for (const aspect of subcriteria.aspects) {
                    if (aspect.type === 'Z') {
                        zedLinkMap[aspect.zedLink] = aspect.id;
                        aspect.zedLink = undefined;
                    }
                }
            }
        }
        for (const criteria of data) {
            for (const subcriteria of criteria.subcriterias) {
                for (const aspect of subcriteria.aspects) {
                    if (aspect.type !== 'Z' && aspect.zedLink !== undefined) {
                        aspect.zedLink = zedLinkMap[aspect.zedLink];
                    }
                }
            }
        }
    }

    async saveToXlsx(squareId: SqrSquareDto['id'],
                     criterias: SqrCriteriaDto[]): Promise<StreamableFile> {
        const fileName = uuid() + '.xlsx';
        const workbook = new Workbook();
        // read excel tempalte
        await workbook.xlsx.readFile(path.join(process.env.TEMPLATE_DIR, 'criteria_template.xlsx'));
        const square = await this.sqrSquareService.getSquare(squareId);
        // modificate workbook
        this.makeZedIndexFromLink(criterias);
        this.mapCriteriasToExcel(square, criterias, workbook);
        // return streaming result file
        await workbook.xlsx.writeFile(path.join(process.env.TEMPLATE_DIR, 'generated', fileName));
        const file = createReadStream(path.join(process.env.TEMPLATE_DIR, 'generated', fileName));
        return new StreamableFile(file);
    }

    makeZedIndexFromLink(data: SqrCriteriaDto[]): void {
        let index = 1;
        const zedLinkMap: { [key: string]: number } = {};
        for (const criteria of data) {
            for (const subcriteria of criteria.subcriterias) {
                for (const aspect of subcriteria.aspects) {
                    if (aspect.type === 'Z') {
                        zedLinkMap[aspect.id] = index;
                        aspect.zedLink = String(index);
                        index++;
                    }
                }
            }
        }
        for (const criteria of data) {
            for (const subcriteria of criteria.subcriterias) {
                for (const aspect of subcriteria.aspects) {
                    if (aspect.type !== 'Z' && aspect.zedLink !== undefined) {
                        aspect.zedLink = String(zedLinkMap[aspect.zedLink]);
                    }
                }
            }
        }
    }

    mapCriteriasToExcel(square: SqrSquareDto,
                        criterias: SqrCriteriaDto[],
                        workbook: Workbook): void {
        const sheet = workbook.getWorksheet('CIS Marking Scheme Import');
        // Найдем название компетенции
        let titleRowIdx = 0;
        sheet.eachRow((row) => {
            if (row.getCell('E').text.includes('Skill name')) {
                if (titleRowIdx === 0) {
                    titleRowIdx = row.number + 1;
                }
            }
        });
        const titleRow = sheet.getRow(titleRowIdx);
        if (titleRow) {
            titleRow.getCell('E').value = square.caption;
        }
        // Найдем начало шапки
        let headerStartRowIdx = 0;
        sheet.eachRow((row) => {
            if (row.getCell('E').text.includes('Criteria')) {
                if (headerStartRowIdx === 0) {
                    headerStartRowIdx = row.number + 1;
                }
            }
        });
        // Заполняем
        for (const criteria of criterias) {
            sheet.duplicateRow(headerStartRowIdx, 1, true);
            const headerRow = sheet.getRow(headerStartRowIdx);
            headerRow.getCell('C').value = criteria.key;
            headerRow.getCell('E').value = criteria.caption;
            headerRow.getCell('F').value = +criteria.mark;
            headerStartRowIdx++;
        }

        // Заполняем критерии основной таблицы
        let mainTableTemplateRowIdx = 0;
        sheet.eachRow((row) => {
            if (row.getCell('K').text.includes('Criterion')) {
                if (mainTableTemplateRowIdx === 0) {
                    mainTableTemplateRowIdx = row.number;
                }
            }
        });
        for (let i = 0; i < criterias.length; i++) {
            const criteria = criterias[i];
            const headerRow = sheet.getRow(mainTableTemplateRowIdx);
            headerRow.getCell('K').value = `Criterion ${criteria.key}`;
            headerRow.getCell('M').value = +criteria.mark;
            if (i < criterias.length - 2) {
                sheet.duplicateRow(mainTableTemplateRowIdx, 2, false);
            }
            const bufferRow = sheet.insertRow(mainTableTemplateRowIdx + 1, 'n');
            bufferRow.height = null;
            bufferRow.getCell('A').value = criteria.id;
            mainTableTemplateRowIdx += 2;
        }
        // работаем с субкритериями и аспектами
        for (const criteria of criterias) {
            let duplicateRowIdx = 0;
            sheet.eachRow((row) => {
                if (row.getCell('A').text === criteria.id) {
                    if (duplicateRowIdx === 0) {
                        duplicateRowIdx = row.number;
                    }
                }
            });
            const row = sheet.getRow(duplicateRowIdx);
            const allStyle: Partial<Style> = {
                font: {
                    name: 'Arial',
                    size: 10,
                },
                border: {
                    top: {style: 'thin'},
                    bottom: {style: 'thin'},
                    left: {style: 'medium'},
                    right: {style: 'medium'},
                },
                alignment: {
                    vertical: 'middle',
                    wrapText: true,
                }
            }
            row.getCell('A').style = {
                ...allStyle,
                font: {bold: true},
                alignment: {...allStyle.alignment, horizontal: 'center'}
            };
            row.getCell('B').style = {...allStyle, font: {bold: true}};
            row.getCell('C').style = {
                ...allStyle,
                alignment: {...allStyle.alignment, horizontal: 'center'}
            };
            row.getCell('D').style = {
                ...allStyle,
                alignment: {...allStyle.alignment, horizontal: 'center'}
            };
            row.getCell('E').style = allStyle;
            row.getCell('F').style = {
                ...allStyle,
                alignment: {...allStyle.alignment, horizontal: 'center'}
            };
            row.getCell('G').style = allStyle;
            row.getCell('H').style = allStyle;
            row.getCell('I').style = {
                ...allStyle,
                alignment: {...allStyle.alignment, horizontal: 'center'}
            };
            row.getCell('J').style = {
                ...allStyle,
                alignment: {...allStyle.alignment, horizontal: 'center'}
            };

            for (let sci = 0; sci < criteria.subcriterias.length; sci++) {
                const subcriteria = criteria.subcriterias[sci];
                const subcriteriaRow = sheet.getRow(duplicateRowIdx);
                subcriteriaRow.getCell('A').value = `${criteria.key}${subcriteria.order}`;
                subcriteriaRow.getCell('B').value = subcriteria.caption;
                subcriteriaRow.getCell('C').value = null;
                subcriteriaRow.getCell('D').value = null;
                subcriteriaRow.getCell('E').value = null;
                subcriteriaRow.getCell('F').value = null;
                subcriteriaRow.getCell('G').value = null;
                subcriteriaRow.getCell('H').value = null;
                subcriteriaRow.getCell('I').value = null;
                subcriteriaRow.getCell('J').value = null;
                sheet.duplicateRow(duplicateRowIdx, 1, true);
                duplicateRowIdx++;
                for (let ai = 0; ai < subcriteria.aspects.length; ai++) {
                    const aspect = subcriteria.aspects[ai];
                    const aspectRow = sheet.getRow(duplicateRowIdx);
                    aspectRow.getCell('A').value = null;
                    aspectRow.getCell('B').value = null;
                    aspectRow.getCell('C').value = aspect.type;
                    aspectRow.getCell('D').value = aspect.zedLink !== undefined ? +aspect.zedLink : null;
                    aspectRow.getCell('E').value = `${aspect.caption}${aspect.description ? '\n' + aspect.description : ''}`;
                    aspectRow.getCell('F').value = null;
                    aspectRow.getCell('G').value = null;
                    aspectRow.getCell('H').value = null;
                    aspectRow.getCell('I').value = aspect.sectionKey ?? '-';
                    aspectRow.getCell('J').value = +aspect.mark;
                    if (ai < subcriteria.aspects.length - 1 ||
                        (aspect.extra ?? []).length > 0 ||
                        criteria.subcriterias[sci + 1]) {
                        sheet.duplicateRow(duplicateRowIdx, 1, true);
                        duplicateRowIdx++;
                    }
                    for (let aei = 0; aei < (aspect.extra ?? []).length; aei++) {
                        const aspectExtra = aspect.extra[aei];
                        const aspectExtraRow = sheet.getRow(duplicateRowIdx);
                        aspectExtraRow.getCell('A').value = null;
                        aspectExtraRow.getCell('B').value = null;
                        aspectExtraRow.getCell('C').value = null;
                        aspectExtraRow.getCell('D').value = null;
                        aspectExtraRow.getCell('E').value = null;
                        aspectExtraRow.getCell('F').value = aspect.type === 'J' ? +aspectExtra.mark : null;
                        aspectExtraRow.getCell('G').value = aspectExtra.description;
                        aspectExtraRow.getCell('H').value = null;
                        aspectExtraRow.getCell('I').value = null;
                        aspectExtraRow.getCell('J').value = aspect.type === 'D' ? +aspectExtra.mark : null;
                        if (aei < aspect.extra.length - 1 || subcriteria.aspects[ai + 1] || criteria.subcriterias[sci + 1]) {
                            sheet.duplicateRow(duplicateRowIdx, 1, true);
                            duplicateRowIdx++;
                        }
                    }
                }
            }
        }
    }
}
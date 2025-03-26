import {Injectable, StreamableFile} from "@nestjs/common";
import {DatabaseService} from "../services/database.service";
import {SqrSquareEvalGroupDto} from "../dtos/sqr-square-eval-group.dto";
import {SqrSquareDto} from "../dtos/sqr-square.dto";
import {UserDto} from "../dtos/user.dto";
import {SqrCriteriaDto} from "../dtos/sqr-criteria.dto";
import {SqrTeamDto} from "../dtos/sqr-team.dto";
import {SqrAspectDto} from "../dtos/sqr-aspect.dto";
import {JsonArray} from "@prisma/client/runtime/library";
import {Style, Workbook} from "exceljs";
import * as path from 'path';
import * as process from "process";
import {createReadStream, unlink} from "fs";
import {v4 as uuid} from 'uuid';
import {SqrSquareService} from "../sqr-square/sqr-square.service";
import {SqrSquareModuleDto} from "../dtos/sqr-square-module.dto";

@Injectable()
export class SqrManageRateService {
    constructor(private databaseService: DatabaseService,
                private sqrSquareService: SqrSquareService) {
    }

    async getAvailableModules(squareId: SqrSquareDto['id'],
                              evalGroupId: SqrSquareEvalGroupDto['id'],
                              user: UserDto): Promise<SqrSquareModuleDto[]> {
        // входит ли пользователь в данную группу проверки?
        const userRec = await this.databaseService.sqr_square_user.findFirst(
            {
                where: {
                    square_id: squareId,
                    sqr_square_eval_group_user: {some: {eval_group_id: evalGroupId}},
                    user_id: user.id
                }
            }
        );
        if (!userRec?.id && user.username !== 'admin' && !user.roles?.includes('allRateViewer')) {
            return [];
        }
        // Какие проверяют модули команда
        const evalGroupRec = await this.databaseService.sqr_square_eval_group.findFirst({where: {id: evalGroupId}});
        // Какие доступны для проверки
        const evalGroupModuleCodes = (evalGroupRec.modules ?? '').split(',').map(m => m.trim());
        const evalGroupModules = await this.databaseService.sqr_square_module.findMany({
            where: {
                square_id: squareId,
                code: {in: evalGroupModuleCodes},
                evaluating: true
            }
        });
        return evalGroupModules.map(rec => ({
            id: rec.id.toNumber(),
            squareId: rec.square_id.toNumber(),
            code: rec.code,
            caption: rec.caption,
            evaluating: rec.evaluating,
        }))
    }

    async getRates(squareId: SqrSquareDto['id'],
                   evalGroupId: SqrSquareEvalGroupDto['id'],
                   moduleId: SqrSquareModuleDto['id'],
                   teamId: SqrTeamDto['id'],
                   user: UserDto): Promise<SqrCriteriaDto[]> {
        // входит ли пользователь в данную группу проверки?
        const userRec = await this.databaseService.sqr_square_user.findFirst(
            {
                where: {
                    square_id: squareId,
                    sqr_square_eval_group_user: {some: {eval_group_id: evalGroupId}},
                    user_id: user.id
                }
            }
        );
        if (!userRec?.id && user.username !== 'admin' && !user.roles?.includes('allRateViewer')) {
            return [];
        }
        // Какие проверяют модули команда
        const evalGroupRec = await this.databaseService.sqr_square_eval_group.findFirst({where: {id: evalGroupId}});
        // Какие доступны для проверки
        const availableModules = (await this.databaseService.sqr_square_module.findMany({
            where: {
                square_id: squareId,
                id: moduleId,
                code: {in: (evalGroupRec.modules ?? '').split(',').map(m => m.trim())},
                evaluating: true
            }
        })).map(rec => rec.id.toNumber());
        // Забираем сохраненную копию данных критериев
        const rates = (await this.databaseService.sqr_square_team.findFirst({
            where: {square_id: squareId, id: teamId,}
        })).rates as unknown as SqrCriteriaDto[];
        return (rates ?? [])
            .filter((criteria) => (availableModules.includes(+criteria.module) ||
                criteria.subcriterias.findIndex((subcriteria) => (availableModules.includes(+subcriteria.module) ||
                    subcriteria.aspects.findIndex((aspect) => (availableModules.includes(+aspect.module))) !== -1)) !== -1
            ))
            .map((criteria) => ({
                ...criteria,
                mark: undefined,
                sumSubcriteriaMark: undefined,
                subcriterias: criteria.subcriterias
                    .filter((subcriteria) => (availableModules.includes(+subcriteria.module) ||
                        subcriteria.aspects.findIndex((aspect) => (availableModules.includes(+aspect.module))) !== -1))
                    .map((subcriteria) => ({
                        ...subcriteria,
                        aspects: subcriteria.aspects.filter((aspect) => (availableModules.includes(+aspect.module)))
                    }))
            }));
    }

    async saveRates(squareId: SqrSquareDto['id'],
                    teamId: SqrTeamDto['id'],
                    rates: SqrCriteriaDto[]): Promise<void> {

        const aspectMap: { [key: string]: SqrAspectDto } = {};
        for (const rate of rates) {
            for (const subcriteria of rate.subcriterias) {
                for (const aspect of subcriteria.aspects) {
                    aspectMap[aspect.id] = aspect;
                }
            }
        }

        const dbRates = (await this.databaseService.sqr_square_team.findFirst({
            where: {square_id: squareId, id: teamId,}
        })).rates as unknown as SqrCriteriaDto[];
        for (const dbRate of dbRates) {
            for (const dbSubcriteria of dbRate.subcriterias) {
                dbSubcriteria.aspects = dbSubcriteria.aspects.map((dbAspect) => ({
                    ...dbAspect,
                    mark: aspectMap[dbAspect.id] ? aspectMap[dbAspect.id].mark : dbAspect.mark,
                    extra: aspectMap[dbAspect.id] ? aspectMap[dbAspect.id].extra : dbAspect.extra,
                }))
            }
        }

        await this.databaseService.sqr_square_team.update({
            where: {id: teamId, square_id: squareId},
            data: {rates: dbRates as unknown as JsonArray}
        });
    }

    async downloadXlsx(squareId: SqrSquareDto['id'],
                       teamId: SqrTeamDto['id'],
                       module: number): Promise<StreamableFile> {
        const dbRates = (await this.databaseService.sqr_square_team.findFirst({
            where: {square_id: squareId, id: teamId}
        })).rates as unknown as SqrCriteriaDto[];
        const square = await this.sqrSquareService.getSquare(squareId);
        for (const rate of dbRates) {
            for (const subcriteria of rate.subcriterias) {
                for (const aspect of subcriteria.aspects) {
                    if (aspect.module !== String(module)) {
                        aspect.maxMark = undefined;
                        for (const extra of aspect.extra) {
                            if (aspect.type !== 'D') {
                                extra.maxMark = undefined;
                            }
                        }
                    }
                }
            }
        }
        const fileName = `rate-${uuid()}.xlsx`;
        const workbook = new Workbook();
        // read excel tempalte
        await workbook.xlsx.readFile(path.join(process.env.TEMPLATE_DIR, 'criteria_template.xlsx'));
        // modificate workbook
        this.mapRatesToExcel(square, dbRates, workbook);
        // return streaming result file
        await workbook.xlsx.writeFile(path.join(process.env.TEMPLATE_DIR, 'generated', fileName));
        const filePath = path.join(process.env.TEMPLATE_DIR, 'generated', fileName);
        const file = createReadStream(filePath);
        file.on('end', () => {
            unlink(filePath, () => ((error: unknown) => {
                if (error) console.error(error);
            }));
        });
        return new StreamableFile(file);
    }

    mapRatesToExcel(square: SqrSquareDto,
                    rates: SqrCriteriaDto[],
                    workbook: Workbook): void {
        const sheet = workbook.getWorksheet('Схема оценок');
        // Найдем название компетенции
        let titleRowIdx = 0;
        sheet.eachRow((row) => {
            if (row.getCell('A').text.includes('Название компетенции')) {
                if (titleRowIdx === 0) {
                    titleRowIdx = row.number + 1;
                }
            }
        });
        const titleRow = sheet.getRow(titleRowIdx);
        if (titleRow) {
            titleRow.eachCell((cell) => {
                if (['A3', 'B3', 'C3'].includes(cell.address)) {
                    cell.value = square.caption;
                }
            });
        }

        // Найдем начало шапки
        let headerStartRowIdx = titleRowIdx + 2;
        // Заполняем
        for (const rate of rates) {
            if (headerStartRowIdx > 6) {
                sheet.duplicateRow(headerStartRowIdx, 1, true);
            }
            const headerRow = sheet.getRow(headerStartRowIdx);
            headerRow.getCell('A').value = rate.key;
            headerRow.getCell('B').value = rate.caption;
            headerRow.getCell('C').value = +rate.maxMark;
            headerStartRowIdx++;
        }
        if (headerStartRowIdx > 6) {
            sheet.spliceRows(headerStartRowIdx, 1);
        }

        // Заполняем критерии основной таблицы
        let mainTableTemplateRowIdx = 0;
        sheet.eachRow((row) => {
            if (row.getCell('A').text.includes('Модуль')) {
                if (mainTableTemplateRowIdx === 0) {
                    mainTableTemplateRowIdx = row.number;
                }
            }
        });
        // Заполняем критерии основной таблицы
        for (let i = 0; i < rates.length; i++) {
            const rate = rates[i];
            if (i < rates.length - 2) {
                sheet.duplicateRow(mainTableTemplateRowIdx, 2, false);
            }
            const bufferRow = sheet.insertRow(mainTableTemplateRowIdx + 1, 'n');
            bufferRow.height = null;
            bufferRow.getCell('A').value = rate.id;
            mainTableTemplateRowIdx += 2;
        }

        for (const rate of rates) {
            let duplicateRowIdx = 0;
            sheet.eachRow((row) => {
                if (row.getCell('A').text === rate.id) {
                    if (duplicateRowIdx === 0) {
                        duplicateRowIdx = row.number;
                    }
                }
            });
            const allStyle: Partial<Style> = {
                font: {
                    name: 'Arial',
                    size: 10,
                },
                alignment: {
                    vertical: 'middle',
                    wrapText: true,
                }
            }

            for (let sci = 0; sci < rate.subcriterias.length; sci++) {
                const subcriteria = rate.subcriterias[sci];
                const subcriteriaRow = sheet.getRow(duplicateRowIdx);
                this.applySubcriteriaRowStyle(subcriteriaRow, allStyle);
                subcriteriaRow.getCell('A').value = `${rate.key}${subcriteria.order}`;
                subcriteriaRow.getCell('B').value = subcriteria.caption;
                subcriteriaRow.getCell('C').value = null;
                subcriteriaRow.getCell('D').value = null;
                subcriteriaRow.getCell('E').value = null;
                subcriteriaRow.getCell('F').value = null;
                subcriteriaRow.getCell('G').value = null;
                subcriteriaRow.getCell('H').value = null;
                subcriteriaRow.getCell('I').value = null;
                subcriteriaRow.getCell('J').value = null;
                subcriteriaRow.getCell('N').value = null;
                sheet.duplicateRow(duplicateRowIdx, 1, true);
                duplicateRowIdx++;
                for (let ai = 0; ai < subcriteria.aspects.length; ai++) {
                    const aspect = subcriteria.aspects[ai];
                    const aspectRow = sheet.getRow(duplicateRowIdx);
                    this.applyAspectRowStyle(aspectRow, allStyle);
                    aspectRow.getCell('A').value = null;
                    aspectRow.getCell('B').value = null;
                    aspectRow.getCell('C').value = aspect.type;
                    aspectRow.getCell('D').value = null;
                    aspectRow.getCell('E').value = aspect.caption;
                    aspectRow.getCell('F').value = null;
                    aspectRow.getCell('G').value = aspect.description;
                    aspectRow.getCell('H').value = aspect.sectionKey ?? '-';
                    aspectRow.getCell('I').value = null;
                    aspectRow.getCell('J').value = null;
                    aspectRow.getCell('N').value = this.getAspectMark(aspect);
                    if (ai < subcriteria.aspects.length - 1 ||
                        (aspect.extra ?? []).length > 0 ||
                        rate.subcriterias[sci + 1]) {
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
                        aspectExtraRow.getCell('F').value = aspect.type === 'J' ? +aspectExtra.order : null;
                        aspectExtraRow.getCell('G').value = aspectExtra.description;
                        aspectExtraRow.getCell('H').value = null;
                        aspectExtraRow.getCell('I').value = aspect.type === 'D' ? aspectExtra.maxMark !== undefined ? (+aspectExtra.maxMark).toFixed(2) : null : null;
                        aspectExtraRow.getCell('J').value = null;
                        aspectExtraRow.getCell('N').value = aspect.type === 'D' ? aspectExtra.mark !== undefined ? (+aspectExtra.mark).toFixed(2) : null : null;
                        if (aei < aspect.extra.length - 1 || subcriteria.aspects[ai + 1] || rate.subcriterias[sci + 1]) {
                            sheet.duplicateRow(duplicateRowIdx, 1, true);
                            duplicateRowIdx++;
                        }
                    }
                }
            }
            const lastRow = sheet.getRow(duplicateRowIdx);
            const fillBottomBorder = (cell: any) => {
                cell.style = {...cell.style, border: {...cell.style.border, bottom: {style: 'thin'}}}
            }
            fillBottomBorder(lastRow.getCell('A'));
            fillBottomBorder(lastRow.getCell('B'));
            fillBottomBorder(lastRow.getCell('C'));
            fillBottomBorder(lastRow.getCell('D'));
            fillBottomBorder(lastRow.getCell('E'));
            fillBottomBorder(lastRow.getCell('F'));
            fillBottomBorder(lastRow.getCell('G'));
            fillBottomBorder(lastRow.getCell('H'));
            fillBottomBorder(lastRow.getCell('I'));
            fillBottomBorder(lastRow.getCell('J'));
        }
    }

    private applySubcriteriaRowStyle(row: any, allStyle: any) {
        const defaultBorder = {
            top: {style: 'thin'},
            bottom: {style: 'thin'},
        };
        const defaultFill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'FFB4C6E7'},
            bgColor: {argb: 'FF000000'}
        };
        row.getCell('A').style = {
            ...allStyle,
            font: {bold: true},
            alignment: {...allStyle.alignment, horizontal: 'center'},
            border: {
                ...defaultBorder,
                left: {style: 'thin'},
            }, fill: defaultFill
        };
        row.getCell('B').style = {...allStyle, font: {bold: true}, border: defaultBorder, fill: defaultFill};
        row.getCell('C').style = {
            ...allStyle,
            alignment: {...allStyle.alignment, horizontal: 'center'}, border: defaultBorder, fill: defaultFill
        };
        row.getCell('D').style = {
            ...allStyle,
            alignment: {...allStyle.alignment, horizontal: 'center'}, border: defaultBorder, fill: defaultFill
        };
        row.getCell('E').style = {...allStyle, border: defaultBorder, fill: defaultFill};
        row.getCell('F').style = {
            ...allStyle,
            alignment: {...allStyle.alignment, horizontal: 'center'}, border: defaultBorder, fill: defaultFill
        };
        row.getCell('G').style = {...allStyle, border: defaultBorder, fill: defaultFill};
        row.getCell('H').style = {...allStyle, border: defaultBorder, fill: defaultFill};
        row.getCell('I').style = {
            ...allStyle,
            alignment: {...allStyle.alignment, horizontal: 'center'}, border: defaultBorder, fill: defaultFill
        };
        row.getCell('J').style = {
            ...allStyle,
            alignment: {...allStyle.alignment, horizontal: 'center'},
            border: {
                ...defaultBorder,
                right: {style: 'thin'},
            }, fill: defaultFill
        };
    }

    private applyAspectRowStyle(row: any, allStyle: any) {
        row.getCell('A').style = {
            ...allStyle,
            font: {bold: true},
            alignment: {...allStyle.alignment, horizontal: 'center'},
            border: {
                left: {style: 'thin'},
            }
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
            alignment: {...allStyle.alignment, horizontal: 'center'},
            border: {
                right: {style: 'thin'},
            }
        };
    }

    private getAspectMark(aspect: SqrAspectDto): string | number | null {
        switch (aspect.type) {
            case "B":
            case "Z": {
                return aspect.mark !== undefined ? +aspect.mark : null;
            }
            case "D": {
                return null;
            }
            case "J": {
                if (aspect.extra.findIndex((extra) => extra.mark !== undefined) !== -1) {
                    const indexes = aspect.extra.reduce((acc: string[], extra) => [...acc, ...extra.mark.split('')], []).sort();
                    const marks: string[] = [];
                    for (const index of indexes) {
                        for (const extra of aspect.extra) {
                            if (extra.mark.includes(index)) {
                                marks.push(extra.order);
                            }
                        }
                    }
                    return marks.join(',');
                }
                return null;
            }
        }
    }
}
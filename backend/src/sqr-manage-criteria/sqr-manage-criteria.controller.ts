import {
    Body,
    Controller,
    Get,
    ParseArrayPipe,
    ParseIntPipe,
    Post,
    Query,
    Request,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {SqrManageCriteriaService} from "./sqr-manage-criteria.service";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {UserDto} from "../dtos/user.dto";
import {SqrSquareDto} from "../dtos/sqr-square.dto";
import {SqrCriteriaDto} from "../dtos/sqr-criteria.dto";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('manage-criteria')
export class SqrManageCriteriaController {
    constructor(private sqrManageCriteriaService: SqrManageCriteriaService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getCriterias(@Request() {user}: { user: UserDto },
                       @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id']): Promise<SqrCriteriaDto[]> {
        return this.sqrManageCriteriaService.getCriterias(squareId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async saveCriterias(@Request() {user}: { user: UserDto },
                        @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id'],
                        @Body(ParseArrayPipe) criterias: SqrCriteriaDto[]): Promise<void> {
        await this.sqrManageCriteriaService.saveCriterias(squareId, criterias);
    }

    @UseGuards(JwtAuthGuard)
    @Post('create-rates')
    async createRates(@Request() {user}: { user: UserDto },
                      @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id']): Promise<void> {
        await this.sqrManageCriteriaService.createRates(squareId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload-xlsx')
    @UseInterceptors(FileInterceptor('file'))
    async loadFromXlsx(@Request() {user}: { user: UserDto },
                       @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id'],
                       @UploadedFile() file: Express.Multer.File): Promise<SqrCriteriaDto[]> {
        return this.sqrManageCriteriaService.loadFromXlsx(squareId, file);
    }

    @UseGuards(JwtAuthGuard)
    @Post('download-xlsx')
    async saveTolsx(@Request() {user}: { user: UserDto },
                    @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id'],
                    @Body(ParseArrayPipe) criterias: SqrCriteriaDto[]): Promise<StreamableFile> {
        return this.sqrManageCriteriaService.saveToXlsx(squareId, criterias);
    }
}
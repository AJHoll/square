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
    UseGuards
} from "@nestjs/common";
import {SqrManageRateService} from "./sqr-manage-rate.service";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {UserDto} from "../dtos/user.dto";
import {SqrSquareDto} from "../dtos/sqr-square.dto";
import {SqrCriteriaDto} from "../dtos/sqr-criteria.dto";
import {SqrSquareEvalGroupDto} from "../dtos/sqr-square-eval-group.dto";
import {SqrTeamDto} from "../dtos/sqr-team.dto";

@Controller('manage-rate')
export class SqrManageRateController {
    constructor(private sqrManageRateService: SqrManageRateService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getRates(@Request() {user}: { user: UserDto },
                   @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id'],
                   @Query('evalGroupId', ParseIntPipe) evalGroupId: SqrSquareEvalGroupDto['id'],
                   @Query('module', ParseIntPipe,) module: number,
                   @Query('teamId', ParseIntPipe) teamId: SqrTeamDto['id'],
    ): Promise<SqrCriteriaDto[]> {
        return this.sqrManageRateService.getRates(squareId, evalGroupId, module, teamId, user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/modules')
    async getAvailableModules(@Request() {user}: { user: UserDto },
                              @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id'],
                              @Query('evalGroupId', ParseIntPipe) evalGroupId: SqrSquareEvalGroupDto['id']): Promise<string[]> {
        return this.sqrManageRateService.getAvailableModules(squareId, evalGroupId, user);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async saveRates(@Request() {user}: { user: UserDto },
                    @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id'],
                    @Query('teamId', ParseIntPipe) teamId: SqrTeamDto['id'],
                    @Body(ParseArrayPipe) rates: SqrCriteriaDto[]): Promise<void> {
        return this.sqrManageRateService.saveRates(squareId, teamId, rates);
    }

    @UseGuards(JwtAuthGuard)
    @Post('download-xlsx')
    async downloadXlsx(@Request() {user}: { user: UserDto },
                       @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id'],
                       @Query('teamId', ParseIntPipe) teamId: SqrTeamDto['id'],
                       @Query('module', ParseIntPipe) module: number): Promise<StreamableFile> {
        return this.sqrManageRateService.downloadXlsx(squareId, teamId, module);
    }
}
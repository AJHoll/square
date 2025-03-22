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
import {HasRoles} from "../guards/roles.decorator";
import {RolesGuard} from "../guards/roles.guard";
import {SqrSquareModuleDto} from "../dtos/sqr-square-module.dto";

@Controller('manage-rate')
export class SqrManageRateController {
    constructor(private sqrManageRateService: SqrManageRateService) {
    }

    @HasRoles(['rateManager', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getRates(@Request() {user}: { user: UserDto },
                   @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id'],
                   @Query('evalGroupId', ParseIntPipe) evalGroupId: SqrSquareEvalGroupDto['id'],
                   @Query('moduleId', ParseIntPipe,) moduleId: SqrSquareModuleDto['id'],
                   @Query('teamId', ParseIntPipe) teamId: SqrTeamDto['id'],
    ): Promise<SqrCriteriaDto[]> {
        return this.sqrManageRateService.getRates(squareId, evalGroupId, moduleId, teamId, user);
    }

    @HasRoles(['rateManager', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/modules')
    async getAvailableModules(@Request() {user}: { user: UserDto },
                              @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id'],
                              @Query('evalGroupId', ParseIntPipe) evalGroupId: SqrSquareEvalGroupDto['id']): Promise<SqrSquareModuleDto[]> {
        return this.sqrManageRateService.getAvailableModules(squareId, evalGroupId, user);
    }

    @HasRoles(['rateManager', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async saveRates(@Request() {user}: { user: UserDto },
                    @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id'],
                    @Query('teamId', ParseIntPipe) teamId: SqrTeamDto['id'],
                    @Body(ParseArrayPipe) rates: SqrCriteriaDto[]): Promise<void> {
        return this.sqrManageRateService.saveRates(squareId, teamId, rates);
    }

    @HasRoles(['rateExporter', 'admin'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('download-xlsx')
    async downloadXlsx(@Request() {user}: { user: UserDto },
                       @Query('squareId', ParseIntPipe) squareId: SqrSquareDto['id'],
                       @Query('teamId', ParseIntPipe) teamId: SqrTeamDto['id'],
                       @Query('module', ParseIntPipe) module: number): Promise<StreamableFile> {
        return this.sqrManageRateService.downloadXlsx(squareId, teamId, module);
    }
}
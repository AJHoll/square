import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {UserDto} from '../dtos/user.dto';
import {SqrSquareService} from './sqr-square.service';
import {SqrSquareDto} from "../dtos/sqr-square.dto";

@Controller('sqr-square')
export class SqrSquareController {

    constructor(private sqrRoleService: SqrSquareService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSquares(@Request() {user}: { user: UserDto }): Promise<SqrSquareDto[]> {
        return this.sqrRoleService.getRoles();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getSquare(@Request() {user}: { user: UserDto },
                    @Param('id') id: SqrSquareDto['id']): Promise<SqrSquareDto> {
        return this.sqrRoleService.getRole(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createSquare(@Request() {user}: { user: UserDto },
                       @Body() admRole: SqrSquareDto): Promise<SqrSquareDto> {
        return this.sqrRoleService.createRole(admRole);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async editSquare(@Request() {user}: { user: UserDto },
                     @Param('id') id: SqrSquareDto['id'],
                     @Body() admRole: SqrSquareDto): Promise<SqrSquareDto> {
        return this.sqrRoleService.editRole(id, admRole);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':ids')
    async deleteSquares(@Request() {user}: { user: UserDto },
                        @Param('ids') ids: string): Promise<void> {

        await this.sqrRoleService.deleteRoles(ids.split(',').map(val => +val));
    }
}

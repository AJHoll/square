import {Module} from '@nestjs/common';
import {SqrSquareController} from './sqr-square.controller';
import {SqrSquareService} from './sqr-square.service';
import {DatabaseService} from '../services/database.service';

@Module({
    controllers: [SqrSquareController],
    providers: [SqrSquareService, DatabaseService],
    exports: [SqrSquareService],
})
export class SqrSquareModule {
}

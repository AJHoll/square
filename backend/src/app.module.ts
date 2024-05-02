import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {MainMenuModule} from './main-menu/main-menu.module';
import {UserInfoMiddleware} from './middleware/user-info.middleware';
import {AdmRoleModule} from './adm-role/adm-role.module';
import {KrnMenuController} from './krn-menu/krn-menu.controller';
import {KrnMenuModule} from './krn-menu/krn-menu.module';
import {AdmGroupModule} from './adm-group/adm-group.module';
import {AdmUserController} from './adm-user/adm-user.controller';
import {AdmUserModule} from './adm-user/adm-user.module';
import {SqrRoleModule} from "./sqr-role/sqr-role.module";
import {SqrSquareModule} from "./sqr-square/sqr-square.module";
import {JwtService} from "@nestjs/jwt";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        AuthModule,
        UserModule,
        MainMenuModule,
        AdmRoleModule,
        KrnMenuModule,
        AdmGroupModule,
        AdmUserModule,
        SqrRoleModule,
        SqrSquareModule
    ],
    controllers: [KrnMenuController, AdmUserController],
    providers: [JwtService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(UserInfoMiddleware).forRoutes('*');
    }
}

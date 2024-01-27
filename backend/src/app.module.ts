import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MainMenuModule } from './main-menu/main-menu.module';
import { UserInfoMiddleware } from './middleware/user-info.middleware';
import { AdmRoleModule } from './adm-role/adm-role.module';
import { KrnMenuController } from './krn-menu/krn-menu.controller';
import { KrnMenuModule } from './krn-menu/krn-menu.module';
import { AdmGroupModule } from './adm-group/adm-group.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MainMenuModule,
    AdmRoleModule,
    KrnMenuModule,
    AdmGroupModule,
  ],
  controllers: [KrnMenuController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(UserInfoMiddleware).forRoutes('*');
  }
}

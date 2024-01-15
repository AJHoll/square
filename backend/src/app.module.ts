import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MainMenuModule } from './main-menu/main-menu.module';
import { UserInfoMiddleware } from './middleware/user-info.middleware';
import { AdmRoleModule } from './role/adm-role.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MainMenuModule,
    AdmRoleModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(UserInfoMiddleware).forRoutes('*');
  }
}

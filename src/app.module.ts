import { Logger, Module, Scope } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
// import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "@/app.controller";
import { AppConfiguration } from "@/config";
import { envFile } from "@/config/env";
// import { TypeOrmFactory } from "@database/typeorm.factory";
import { GlobalCatcher, HttpErrorFilter } from "@helpers/filter-error.http";
// import { AuthModule } from "@modules/auth/auth.module";
// import { UsersModule } from "@modules/users/users.module";

import { ReportsController } from "./modules/reports/reports.controller";
import { ReportsModule } from "./modules/reports/reports.module";
import { NotionController } from "./services/notion/notion.controller";
import { NotionService } from "./services/notion/notion.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: envFile(),
      load: [AppConfiguration],
    }),
    // TypeOrmModule.forRootAsync({ useClass: TypeOrmFactory }),
    // AuthModule,
    // UsersModule,
    ReportsModule,
  ],
  controllers: [AppController, ReportsController, NotionController],
  providers: [
    {
      provide: APP_FILTER,
      scope: Scope.REQUEST,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_FILTER,
      scope: Scope.REQUEST,
      useClass: GlobalCatcher,
    },
    NotionService,
    Logger,
  ],
})
export class AppModule {}

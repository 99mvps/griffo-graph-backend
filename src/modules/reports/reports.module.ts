import { Module, Scope } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

import { NotionService } from "@/services/notion/notion.service";

import { ExpensesMapper } from "./report-expenses.mapper";
import { ReportsController } from "./reports.controller";
import { MyMiddleware } from "./reports.middleware";
import { ReportsService } from "./reports.service";

@Module({
  providers: [
    ReportsService,
    NotionService,
    ExpensesMapper,
    {
      provide: APP_FILTER,
      scope: Scope.REQUEST,
      useClass: MyMiddleware,
    },
  ],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}

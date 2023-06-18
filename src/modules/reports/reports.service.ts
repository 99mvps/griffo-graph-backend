import { Inject, Injectable } from "@nestjs/common";

import { NotionTables } from "src/services/notion/notion-enum.databases";
import { NotionService } from "src/services/notion/notion.service";

import { ExpensesMapper } from "./report-expenses.mapper";
import { ReportExpensesTable } from "./reports.interfaces";

@Injectable()
export class ReportsService {
  private readonly monthMapper = new Map([
    [1, "Janeiro"],
    [2, "Fevereiro"],
    [3, "Março"],
    [4, "Abril"],
    [5, "Maio"],
    [6, "Junho"],
    [7, "Julho"],
    [8, "Agosto"],
    [9, "Setembro"],
    [10, "Outubro"],
    [11, "Novembro"],
    [12, "Dezembro"],
  ]);
  constructor(
    @Inject(NotionService) readonly notionService: NotionService,
    private readonly expensesMapper: ExpensesMapper
  ) {}

  private setMap(dataset, mappedDbItem) {
    const month = new Date(mappedDbItem.paymentDate).getMonth() + 1;
    const monthName = this.monthMapper.get(month);
    const dataSetMonth = dataset.get(monthName);

    if (dataSetMonth) {
      dataSetMonth.total += mappedDbItem.value;
      dataSetMonth.rows.push(mappedDbItem);
    } else {
      dataset.set(monthName, {
        month: monthName,
        total: mappedDbItem.value,
        rows: [mappedDbItem],
      });
    }
  }

  async generateChartData() {
    const databaseItems = await this.notionService.retrieveDatabaseItems(NotionTables.EXPENSES);

    const dataset = new Map<string, { month: string; total: number; rows: unknown[] }>();

    const semDataCategory = "Sem data";

    // console.log(this.request);

    databaseItems.results.forEach((item: ReportExpensesTable) => {
      const mappedDbItem = this.expensesMapper.map(item);

      if (mappedDbItem.paymentDate) {
        const month = new Date(mappedDbItem.paymentDate).getMonth() + 1;
        const monthName = this.monthMapper.get(month);
        const dataSetMonth = dataset.get(monthName);

        if (dataSetMonth) {
          dataSetMonth.total += mappedDbItem.value;
          dataSetMonth.rows.push(mappedDbItem);
        } else {
          dataset.set(monthName, {
            month: monthName,
            total: mappedDbItem.value,
            rows: [mappedDbItem],
          });
        }
        return;
      } else {
        if (mappedDbItem.futurePaymentDate) {
          const month = new Date(mappedDbItem.futurePaymentDate).getMonth() + 1;
          const monthName = this.monthMapper.get(month);
          const dataSetMonth = dataset.get(monthName);

          if (dataSetMonth) {
            dataSetMonth.total += mappedDbItem.value;
            dataSetMonth.rows.push(mappedDbItem);
          } else {
            dataset.set(monthName, {
              month: monthName,
              total: mappedDbItem.value,
              rows: [mappedDbItem],
            });
          }

          return;
        }

        const semDataEntry = dataset.get(semDataCategory);

        if (semDataEntry && !mappedDbItem.paymentDate) {
          semDataEntry.total += mappedDbItem.value;
          semDataEntry.rows.push(mappedDbItem);
        } else {
          dataset.set(semDataCategory, {
            month: semDataCategory,
            total: mappedDbItem.value,
            rows: [mappedDbItem],
          });
        }
      }
    });
    dataset.forEach((imtem) => (imtem.total = Number(imtem.total.toFixed(2))));
    return Array.from(dataset.values());
  }
}

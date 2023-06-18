import { Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

import { ReportExpensesResponse, ReportExpensesTable } from "./reports.interfaces";

class ReportExpensesResponseTransformer implements ReportExpensesResponse {
  @IsNumber()
  value: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  category: { id: string; name: string; color: string }[];

  @IsDate()
  futurePaymentDate: Date | null;

  @IsString()
  status: string;

  @IsDate()
  paymentDate: Date | null;
}

@Injectable()
export class ExpensesMapper {
  map(dataTableItem: ReportExpensesTable): ReportExpensesResponse {
    return plainToClass(ReportExpensesResponseTransformer, {
      value: dataTableItem.properties.Valor.number,
      name: dataTableItem.properties.Nome.title[0].plain_text,
      category: dataTableItem.properties.Categorias.multi_select,
      futurePaymentDate: dataTableItem.properties.Notificar?.date?.start
        ? new Date(dataTableItem.properties.Notificar.date.start)
        : null,
      status: dataTableItem.properties.Status.status.name,
      paymentDate: dataTableItem.properties["Data do Pagamento"]?.date?.start
        ? new Date(dataTableItem.properties["Data do Pagamento"].date.start)
        : null,
    });
  }
}

import {
  FinancialResult,
  PropertyValueNumber,
  PropertyValueDate,
  PropertyValueTitle,
  PropertyValueMultiSelect,
  PropertyValueStatus,
} from "@/services/notion/notion.interfaces";

export type ReportExpensesTable = FinancialResult & {
  properties: {
    Valor: PropertyValueNumber;
    "Data do Pagamento": PropertyValueDate;
    Notificar: PropertyValueDate;
    Nome: PropertyValueTitle;
    Categorias: PropertyValueMultiSelect;
    Status: PropertyValueStatus;
  };
};

export type ReportExpensesResponse = {
  value: number;
  name: string;
  category: { id: string; name: string; color: string }[];
  futurePaymentDate: Date | null;
  status: string;
  paymentDate: Date | null;
};

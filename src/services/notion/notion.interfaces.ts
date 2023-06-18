import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

export type RawDatabaseFinancialData = {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: string;
    id: string;
  };
  last_edited_by: {
    object: string;
    id: string;
  };
  cover: null | string;
  icon: null | string;
  parent: {
    type: string;
    database_id: string;
  };
  archived: boolean;
  properties: {
    Valor: {
      id: string;
      type: string;
      number: number;
    };
    Status: {
      id: string;
      type: string;
      status: {
        id: string;
        name: string;
        color: string;
      };
    };
    Notificar: {
      id: string;
      type: string;
      date: null;
    };
    "Data do Pagamento": {
      id: string;
      type: string;
      date: {
        start: string;
        end: null;
        time_zone: null;
      };
    };
    Categorias: {
      id: string;
      type: string;
      multi_select: string[];
    };
    Nome: {
      id: string;
      type: string;
      title: [
        {
          type: string;
          text: {
            content: string;
            link: null;
          };
          annotations: {
            bold: boolean;
            italic: boolean;
            strikethrough: boolean;
            underline: boolean;
            code: boolean;
            color: string;
          };
          plain_text: string;
          href: null;
        }
      ];
    };
  };
  url: string;
  public_url: null | string;
};

export type FinancialResult = Extract<
  QueryDatabaseResponse["results"][number],
  { properties: Record<string, unknown> }
>;

type PropertyValueMap = FinancialResult["properties"];
type PropertyValue = PropertyValueMap[string];

type PropertyValueType = PropertyValue["type"];

type ExtractedPropertyValue<TType extends PropertyValueType> = Extract<
  PropertyValue,
  { type: TType }
>;

export type PropertyValueTitle = ExtractedPropertyValue<"title">;
export type PropertyValueStatus = ExtractedPropertyValue<"status">;
export type PropertyValueRichText = ExtractedPropertyValue<"rich_text">;
export type PropertyValueMultiSelect = ExtractedPropertyValue<"multi_select">;
export type PropertyValueUrl = ExtractedPropertyValue<"url">;
export type PropertyValueNumber = ExtractedPropertyValue<"number">;
export type PropertyValueDate = ExtractedPropertyValue<"date">;
export type PropertyValueEditedTime = ExtractedPropertyValue<"last_edited_time">;

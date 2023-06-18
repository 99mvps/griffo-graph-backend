import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "@notionhq/client";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

import { TAppConfiguration } from "@/config";

const notionClientSecret = "secret_tWuiQ4zUUEX9haGLlfxzQobfuCaEzWczic0rQXzvKqv";

const notionClientId = "cc5fb5e1-5da3-4a20-9a11-22faad4f1254";

@Injectable()
export class NotionService {
  private readonly notion: Client;

  constructor(private readonly configService: ConfigService<TAppConfiguration>) {
    this.notion = new Client({
      auth: this.configService.get("notionSoService"),
    });
  }

  async connectNotion(code: string): Promise<unknown> {
    try {
      console.log("connectNotion");
      // const resp = fetch({
      //   method: "POST",
      //   url: "https://api.notion.com/v1/oauth/token",
      //   auth: { username: notionClientId, password: notionClientSecret },
      //   headers: { "Content-Type": "application/json" },
      //   data: { code, grant_type: "authorization_code" },
      // });
      console.log(code);
      const resp = await fetch("https://api.notion.com/v1/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${notionClientId}:${notionClientSecret}`,
            "utf-8"
          ).toString("base64")}`,
          // 'Notion-Version: 2022-06-28'
        },
        body: JSON.stringify({
          code,
          grant_type: "authorization_code",
          // redirect_uri:
          // "https://api.notion.com/v1/oauth/authorize?client_id=cc5fb5e1-5da3-4a20-9a11-22faad4f1254&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fgriffo-graph.vercel.app",
        }),
      });

      const access_token = await resp.json();
      console.log(access_token);
      return access_token;

      // const { data } = await axios({
      //   method: "POST",
      //   url: "https://api.notion.com/v1/search",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${resp.data.access_token}`,
      //     "Notion-Version": "2022-02-22",
      //   },
      //   data: { filter: { property: "object", value: "database" } },
      // });
    } catch (error) {
      console.error("aqui", error);
      throw error;
    }
  }

  async retrieveDatabaseItems(databaseId: string): Promise<QueryDatabaseResponse> {
    try {
      const response = await this.notion.databases.query({
        database_id: databaseId,
      });

      return response;
    } catch (error) {
      console.error("Error retrieving page:", error);
      throw error;
    }
  }
}

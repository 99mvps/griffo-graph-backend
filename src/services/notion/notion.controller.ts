import { Controller, Post, Body } from "@nestjs/common";

import { NotionService } from "./notion.service";

@Controller("notion")
export class NotionController {
  constructor(readonly notionService: NotionService) {}

  @Post("/auth")
  getNotionAccessToken(@Body() { code }: { code: string }) {
    return this.notionService.connectNotion(code);
  }
}

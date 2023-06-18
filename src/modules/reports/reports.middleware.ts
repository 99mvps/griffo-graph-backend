import { Injectable, NestMiddleware } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

@Injectable()
export class MyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): void {
    req.data = "Some request data"; // Set your desired request-specific data
    next();
  }
}

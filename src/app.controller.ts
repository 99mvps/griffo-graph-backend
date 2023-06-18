import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  UnauthorizedException,
  Inject,
  Query,
  Logger,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

// import { AuthService } from "./modules/auth/auth.service";
import { AuthDTO, BearerTokenDTO } from "./modules/auth/auth.dto";
import { JwtAuthGuard } from "./modules/auth/jwt.guard";
import { LocalAuthGuard } from "./modules/auth/local.guard";

@Controller()
export class AppController {
  constructor(
    // @Inject(AuthService)
    // private authService: AuthService,
    @Inject(Logger)
    readonly logger: Logger
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  @ApiOperation({
    summary: "Realiza o login de um usuário.",
  })
  @ApiBody({
    description: "Credenciais do usuário.",
    type: AuthDTO,
  })
  @ApiOkResponse({
    description: "Bearer token.",
    type: BearerTokenDTO,
  })
  @ApiNotFoundResponse({
    description: "Paciente não econtrado.",
    type: UnauthorizedException,
  })
  @ApiTags("Login")
  async login(@Request() req: AuthDTO) {
    return req;
    // return this.authService.login(req.user);
  }

  @ApiOperation({
    summary: "Apenas para validar o token gerado.",
  })
  @ApiOkResponse({
    description: "PING-PONG.",
  })
  @Get("/private-route")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  async _private() {
    return "PONG";
  }

  @Get()
  getNotionResource(@Query("code") code: string): string {
    // also is possible to get the access_token here
    // so which one is better?
    this.logger.verbose({ ["Notion OAuth code"]: code });
    return code;
  }
}

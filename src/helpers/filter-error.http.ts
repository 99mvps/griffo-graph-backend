import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";

import { ServiceLayerError } from "@helpers/errors/ServiceException.error";

@Catch(ServiceLayerError)
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(`${HttpErrorFilter.name}/${ServiceLayerError.name}`);

  async catch(exception: ServiceLayerError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    this.logger.log(JSON.stringify(exception.extraInfo, null, 2));

    response.status(exception.statusCode).json({
      message: exception.message,
      name: exception.name,
      statusCode: exception.statusCode,
    });
  }
}

type ExceptionFilterCatch = {
  name: string;
  response: Record<string, string | number>;
  status: string | number;
  message: string;
};

@Catch()
export class GlobalCatcher implements ExceptionFilter {
  private readonly logger = new Logger(GlobalCatcher.name);

  async catch(exception: ExceptionFilterCatch, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    this.logger.log(JSON.stringify(exception, null, 2));

    const globalExceptionCode =
      exception.response?.statusCode || exception.status || HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(globalExceptionCode).json({
      message: exception.response ?? exception.message,
      name: exception.name,
      statusCode: globalExceptionCode,
    });
  }
}

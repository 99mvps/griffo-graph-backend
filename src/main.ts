import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const customErrors: Record<string, Array<string>> = {};

        errors.forEach((el) => {
          customErrors[el.property] = Object.values(el.constraints);
        });

        return new BadRequestException(customErrors);
      },
    })
  );

  //Swagger configurations
  const options = new DocumentBuilder()
    .setTitle(configService.get("project.title"))
    .setDescription(configService.get("project.description"))
    .setVersion(configService.get("project.version"))
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "access-token")
    .build();

  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, options));

  await app.listen(configService.get("port"));
}

bootstrap();

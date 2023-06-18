import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmFactory implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.config.get("database.type"),
      name: this.config.get("database.name"),
      host: this.config.get("database.host"),
      port: this.config.get("database.port"),
      username: this.config.get("database.username"),
      password: this.config.get("database.password"),
      subscribers: this.config.get("database.subscribers"),
      autoLoadEntities: true,
      synchronize: false,
    } as TypeOrmModuleOptions;
  }
}

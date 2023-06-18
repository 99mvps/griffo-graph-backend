import { DataSource } from "typeorm";

import { User } from "src/modules/users/user.entity";

import { AppConfiguration } from "../config";

const { database } = AppConfiguration();

delete database.autoLoadEntities;

export const databaseConfig = {
  ...database,
  entities: [User],
};
export const TestDataSourceSetup = new DataSource(databaseConfig);

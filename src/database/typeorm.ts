import { DataSource } from "typeorm";

import { AppConfiguration } from "@/config/index";
import { User } from "@/modules/users/user.entity";

const { database } = AppConfiguration();

delete database.autoLoadEntities;

export const databaseConfig = {
  ...database,
  entities: [User,],
};
export const TestDataSourceSetup = new DataSource(databaseConfig);

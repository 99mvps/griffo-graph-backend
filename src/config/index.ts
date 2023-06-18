import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export type TAppConfiguration = {
  project: {
    title: string;
    description: string;
    version: string;
  };
  port: number;
  connectionTimeout: number;
  lang: string;
  notionSoService: string;
  database: PostgresConnectionOptions & {
    migrationsTableName: string;
    subscribers: string[];
    migrations: string[];
    autoLoadEntities: boolean;
    synchronize: boolean;
    logging: boolean;
    name: string;
    cli: {
      migrationsDir: string;
    };
  };
  jwt: {
    default: {
      expiresInJWT: string;
      secretKey: string;
    };
  };
};

export const AppConfiguration = () =>
  ({
    project: {
      title: "GRifo Graph",
      description: "API do app Grifo Graphs",
      version: process.env.npm_package_version,
    },
    port: parseInt(process.env.PORT, 10) || 3001,
    connectionTimeout: 28000,
    lang: "pt-BR",
    notionSoService: process.env.NOTION_SO_API_KEY,
    database: {
      type: process.env.DATABASE_TYPE as PostgresConnectionOptions["type"],
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      migrationsTableName: `${process.env.DATABASE_NAME}_migrations`,
      database: process.env.DATABASE_NAME,
      subscribers: ["dist/**/*.subscriber{.js,.ts}"],
      migrations: ["dist/database/migrations/*{.js,.ts}"],
      autoLoadEntities: true,
      synchronize: false,
      logging: false,
      name: "default",
      cli: {
        migrationsDir: "src/database/migrations",
      },
    },
    jwt: {
      default: {
        expiresInJWT: "1h",
        secretKey: process.env.AUTHORIZER_SECRET_KEY || "05e9eadd-d1c7-490c-a74f-0f8ec2b67ber",
      },
    },
  } as TAppConfiguration);

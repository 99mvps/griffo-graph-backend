import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";

import { AppController } from "@/app.controller";
import { AppModule } from "@/app.module";
import { UserRoles } from "@/modules/users/user.entity";
import { build as userMock } from "@test/mocks/users.mock";

import { AuthService } from "./modules/auth/auth.service";
import { UsersService } from "./modules/users/users.service";

jest.setTimeout(30000);

describe("AppModule", () => {
  let app: INestApplication;
  const appController = { public: () => "Hello World", _private: () => "PONG" };
  let authService: AuthService;
  let userService: UsersService;
  const user = userMock();
  let accessToken = "";

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppController)
      .useValue(appController)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userService = moduleRef.get<UsersService>(UsersService);
    authService = moduleRef.get<AuthService>(AuthService);

    // delete user.userAppointments;
    // delete user.id;
    // {
    //   name: "Elsa Feeney",
    //   email: "Eleanore_Goodwin@yahoo.com",
    //   role: UserRoles.ADMIN,
    //   password: "jr89T3aTizmaCPF",
    // }
    // const createdUser = await userService.create(user);
    // console.log(user, createdUser);
    // const sigin = await authService.login({
    //   id: "7d184f2f-cac4-48e8-be05-8d0a5dbb3ba9",
    //   email: "medico0@email.com",
    //   name: "Medico 0",
    //   createdAt: new Date(),
    //   role: UserRoles.ADMIN,
    // });
    const sigin = await authService.login({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: new Date(),
      role: UserRoles.ADMIN,
    });

    accessToken = sigin.accessToken;
  });

  it(`/GET initial public route`, async () => {
    console.log("que horas abre?", accessToken);
    return await request(app.getHttpServer()).get("/").expect(200).expect(appController.public());
  });

  it(`/GET initial protected route`, () => {
    console.log("que horas testa?");
    return request(app.getHttpServer())
      .get("/private-route")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
      .expect(appController._private());
  });

  it(`/GET all appoitnemtns`, () => {
    return request(app.getHttpServer())
      .get("/by-doctor")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  afterAll(async () => {
    console.log("que horas fecha?");
    await app.close();
  });
});

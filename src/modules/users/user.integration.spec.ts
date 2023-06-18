import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { UUIDVersion } from "class-validator";
import { Repository } from "typeorm";

import { databaseConfig } from "@/database/typeorm";
import { User } from "./modules/users/user.entity";
import { UsersModule } from "./modules/users/users.module";
import { UsersService } from "./modules/users/users.service";
import { Patient } from "./modules/veterinarians/patients/patient.entity";
import { build as userMock } from "@test/mocks/users.mock";

jest.setTimeout(30000);

let app: INestApplication;
let userService: UsersService;
let userRepo: Repository<User>;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [UsersModule, TypeOrmModule.forRoot(databaseConfig)],
  }).compile();

  app = module.createNestApplication();

  await app.init();

  userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  userService = await module.resolve<UsersService>(UsersService);
});

afterAll(async () => {
  await app.close();
});

describe("Users integration Tests", () => {
  it("Should soft delete the user", async () => {
    const user = userMock() as Patient;

    const persistedUser = await userRepo.save(user);
    expect(persistedUser.deletedAt).toBeNull();

    await userService.remove(persistedUser.id as UUIDVersion);

    const userAfterSoftRemove = await userRepo.findOne({
      where: {
        id: persistedUser.id,
      },
    });

    expect(persistedUser.id).toEqual(user.id);
    expect(userAfterSoftRemove).toBeNull();

    const userEvenRemoved = await userRepo.findOne({
      where: {
        id: persistedUser.id,
      },
      withDeleted: true,
    });
    expect(userEvenRemoved).not.toBeNull();
    expect(userEvenRemoved.deletedAt).toBeInstanceOf(Date);
  });
});

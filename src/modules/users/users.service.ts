import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUIDVersion } from "class-validator";
import { DeleteResult, Repository, TypeORMError, UpdateResult } from "typeorm";

import { PostgresErrorCode } from "src/database/typeorm.pgsql-errors.enum";
import { ServiceLayerError } from "src/helpers/errors/ServiceException.error";

import { CreateUserDTO, FilterUsersDTO, UpdateUserDTO } from "./user.dto";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>
  ) {}

  async findOne(userEmail: string): Promise<User> {
    try {
      return await this.usersRepo.findOneOrFail({
        where: {
          email: userEmail,
        },
      });
    } catch (error) {
      throw new ServiceLayerError(HttpStatus.NOT_FOUND, "Usuário não econtrado.", {
        message: error.message,
        errorCode: PostgresErrorCode.unique_violation,
      });
    }
  }

  async create(user: CreateUserDTO): Promise<User> {
    console.log({ user });
    try {
      return this.usersRepo.save(user);
    } catch (error) {
      console.log(error);
      if (error instanceof TypeORMError) {
        throw new ServiceLayerError(HttpStatus.CONFLICT, "Erro ao salvar o usuário.", {
          message: error.message,
          errorCode: PostgresErrorCode.unique_violation,
        });
      }
      throw new ServiceLayerError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(userId: UUIDVersion, user: UpdateUserDTO): Promise<User | UpdateResult> {
    try {
      return await this.usersRepo.update(userId, user);
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new ServiceLayerError(HttpStatus.CONFLICT, "Erro ao atualizar o usuário.", {
          message: error.message,
          errorCode: PostgresErrorCode.unique_violation,
        });
      }
      throw new ServiceLayerError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(userId: UUIDVersion): Promise<User | DeleteResult> {
    try {
      return await this.usersRepo.softDelete(userId);
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new ServiceLayerError(HttpStatus.CONFLICT, "Erro ao excluidr o usuário.", {
          message: error.message,
          errorCode: PostgresErrorCode.unique_violation,
        });
      }
      throw new ServiceLayerError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(params: FilterUsersDTO): Promise<User[]> {
    const findQuery = {
      where: params,
    };

    return this.usersRepo.find(findQuery);
  }

  async find(userId: UUIDVersion): Promise<User> {
    return await this.usersRepo.findOne({
      where: {
        id: userId as string,
      },
    });
  }
}

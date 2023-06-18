import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

import { UserRoles } from "./user.entity";

export class UsersDTO {
  @Expose()
  @ApiProperty({
    description: "O ID do usuário.",
    example: "296317cd-e432-4f97-82b0-eadcfb02d642",
  })
  id: string;

  @Expose()
  @IsNotEmpty({
    message: "Deve informar o nome do usuário.",
  })
  @ApiProperty({
    description: "O nome do usuário.",
    example: "Rodrigo Nascimento",
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: "O email do usuário.",
    example: "nome@email.com",
  })
  @IsNotEmpty({
    message: "Precisa informar um email.",
  })
  @IsEmail({}, { message: "Email inválido." })
  @MaxLength(64)
  email: string;

  @ApiProperty({
    type: "enum",
    enum: UserRoles,
  })
  @IsEnum(UserRoles)
  role: UserRoles;

  @Expose()
  @ApiProperty({ description: "A data de criação do paciente." })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: "A data de criação do paciente." })
  updatedAt?: Date;
}

export type FilterUsersDTO = Omit<UsersDTO, "password">;

export class CreateUserDTO extends PartialType(
  OmitType(UsersDTO, ["id", "createdAt", "updatedAt"] as const)
) {
  @Expose()
  @ApiProperty({
    description: "A senha do usuário.",
    example: "SECRET",
  })
  @IsString({
    message: "Uma senha deve ser fornecida.",
  })
  @MinLength(6, {
    message: "A senha precisa ter pelo menos 6 caracteres.",
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Senha muito fraca. Obrigatório uma letra maiúscula, uma minúsucula, um número e um caracter especial.",
  })
  password: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}

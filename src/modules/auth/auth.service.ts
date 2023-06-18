import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { UsersDTO } from "@modules/users/user.dto";
import { User } from "@modules/users/user.entity";
import { UsersService } from "@modules/users/users.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(userEmail: string, pass: string): Promise<Omit<User, "password">> {
    const user = await this.usersService.findOne(userEmail);

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (user && isPasswordValid) {
      // eslint-disable-next-line
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UsersDTO) {
    const payload = {
      sub: user.id,
      userEmail: user.email,
      userName: user.name,
      userRole: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

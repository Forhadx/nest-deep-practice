import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import ms from "ms";
import crypto from "crypto";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { AuthEmailLoginDto } from "./dto/auth-email-login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "../../../config/config.type";
import { MailService } from "../../../common/mail/mail.service";
import { Session } from "../../../common/session/domain/session";
import { SessionService } from "../../../common/session/session.service";
import { EmployeeService } from "../employee/employee.service";
import { Admin } from "../admin/domain/admin";
import { Employee } from "../employee/domain/employee";
import { AdminService } from "../admin/admin.service";
import { JwtRefreshPayloadType } from "./strategies/types/jwt-refresh-payload.type";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private adminService: AdminService,
    private employeeService: EmployeeService,
    private sessionService: SessionService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    let user: Admin | Employee | null = null;

    const [adminData, employeeData] = await Promise.all([
      this.adminService.findByEmail(loginDto.email),
      this.employeeService.findByEmail(loginDto.email),
    ]);

    if (adminData) {
      user = adminData;
    } else if (employeeData) {
      user = employeeData;
    }

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: "notFound",
        },
      });
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: "incorrectPassword",
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: "incorrectPassword",
        },
      });
    }

    const hash = crypto
      .createHash("sha256")
      .update(randomStringGenerator())
      .digest("hex");

    const session = await this.sessionService.create({
      userId: user?.id,
      role: user?.role,
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  async confirmEmail(hash: string): Promise<void> {
    let userId: (Admin | Employee)["id"];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: (Admin | Employee)["id"];
      }>(hash, {
        secret: this.configService.getOrThrow("auth.confirmEmailSecret", {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.employeeService.findById(userId);

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `notFound`,
      });
    }

    // user.status = EUserStatus.Active;
    await this.employeeService.update(user.id, user);
  }

  async confirmNewEmail(hash: string): Promise<void> {
    let userId: (Admin | Employee)["id"];
    let newEmail: (Admin | Employee)["email"];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: (Admin | Employee)["id"];
        newEmail: (Admin | Employee)["email"];
      }>(hash, {
        secret: this.configService.getOrThrow("auth.confirmEmailSecret", {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
      newEmail = jwtData.newEmail;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.employeeService.findById(userId);

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `notFound`,
      });
    }

    user.email = newEmail;
    // user.status = EUserStatus.Active;

    await this.employeeService.update(user.id, user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.employeeService.findByEmail(email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: "emailNotExists",
        },
      });
    }

    const tokenExpiresIn = this.configService.getOrThrow("auth.forgotExpires", {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const hash = await this.jwtService.signAsync(
      {
        forgotUserId: user.id,
      },
      {
        secret: this.configService.getOrThrow("auth.forgotSecret", {
          infer: true,
        }),
        expiresIn: tokenExpiresIn,
      },
    );

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
        tokenExpires,
      },
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    let userId: (Admin | Employee)["id"];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: (Admin | Employee)["id"];
      }>(hash, {
        secret: this.configService.getOrThrow("auth.forgotSecret", {
          infer: true,
        }),
      });

      userId = jwtData.forgotUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.employeeService.findById(userId);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `notFound`,
        },
      });
    }

    user.password = password;

    await this.sessionService.deleteByUserId({
      userId: user.id,
    });

    await this.employeeService.update(user.id, user);
  }
  // */

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, "sessionId" | "hash">,
  ): Promise<Omit<LoginResponseDto, "user">> {
    const session = await this.sessionService.findById(data.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash("sha256")
      .update(randomStringGenerator())
      .digest("hex");

    let user: Admin | Employee | null = null;

    const [adminData, employeeData] = await Promise.all([
      this.adminService.findById(session.userId),
      this.employeeService.findById(session.userId),
    ]);

    if (adminData) {
      user = adminData;
    } else if (employeeData) {
      user = employeeData;
    }

    if (!user?.role) {
      throw new UnauthorizedException();
    }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.userId,
      role: user.role,
      sessionId: session.id,
      hash,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async logout(data: Pick<JwtRefreshPayloadType, "sessionId">) {
    return this.sessionService.deleteById(data.sessionId);
  }

  private async getTokensData(data: {
    id: (Admin | Employee)["id"];
    role: Admin | Employee["role"];
    sessionId: Session["id"];
    hash: Session["hash"];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow("auth.expires", {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow("auth.secret", { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow("auth.refreshSecret", {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow("auth.refreshExpires", {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}

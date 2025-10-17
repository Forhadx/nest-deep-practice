import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  SerializeOptions,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthEmailLoginDto } from "./dto/auth-email-login.dto";
import { AuthForgotPasswordDto } from "./dto/auth-forgot-password.dto";
import { AuthConfirmEmailDto } from "./dto/auth-confirm-email.dto";
import { AuthResetPasswordDto } from "./dto/auth-reset-password.dto";
import { AuthGuard } from "@nestjs/passport";
import { LoginResponseDto } from "./dto/login-response.dto";
import { RefreshResponseDto } from "./dto/refresh-response.dto";

@ApiTags("Auth")
@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @SerializeOptions({
    groups: ["me"],
  })
  @Post("email/login")
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    return this.service.validateLogin(loginDto);
  }

  // /*
  @Post("email/confirm")
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmEmail(confirmEmailDto.hash);
  }

  @Post("email/confirm/new")
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmNewEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmNewEmail(confirmEmailDto.hash);
  }

  @Post("forgot/password")
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post("reset/password")
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: RefreshResponseDto,
  })
  @SerializeOptions({
    groups: ["me"],
  })
  @Post("refresh")
  @UseGuards(AuthGuard("jwt-refresh"))
  @HttpCode(HttpStatus.OK)
  public refresh(@Request() request): Promise<RefreshResponseDto> {
    // use refresh token
    return this.service.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    });
  }

  @ApiBearerAuth()
  @Post("logout")
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Request() request): Promise<void> {
    await this.service.logout({
      sessionId: request.user.sessionId,
    });
  }
  // */
}

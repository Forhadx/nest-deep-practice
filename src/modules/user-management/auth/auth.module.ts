import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AnonymousStrategy } from "./strategies/anonymous.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { MailModule } from "../../../common/mail/mail.module";
import { SessionModule } from "../../../common/session/session.module";
import { AdminModule } from "../admin/admin.module";
import { EmployeeModule } from "../employee/employee.module";

@Module({
  imports: [
    AdminModule,
    EmployeeModule,
    SessionModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, AnonymousStrategy],
  exports: [AuthService],
})
export class AuthModule {}

import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AdminModule } from "./admin/admin.module";
import { EmployeeModule } from "./employee/employee.module";

@Module({
  imports: [AuthModule, EmployeeModule, AdminModule],
})
export class UsersManagementModule {}

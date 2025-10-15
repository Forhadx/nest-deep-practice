import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Employee } from "../../employee/domain/employee";
import { Admin } from "../../admin/domain/admin";

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpires: number;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Admin) }, { $ref: getSchemaPath(Employee) }],
  })
  user: Admin | Employee;
}

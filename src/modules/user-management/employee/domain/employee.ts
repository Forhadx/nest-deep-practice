import { Exclude, Expose } from "class-transformer";
import { FileType } from "../../../../common/files/domain/file";
import { ApiProperty } from "@nestjs/swagger";
import { ERole } from "../../../../enums/roles.enum";
import { EEmployeeStatus } from "../../../../enums/employeeStatus.enum";

export class Employee {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    example: "john.doe@example.com",
  })
  @Expose({ groups: ["me", "admin"] })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiProperty({
    type: String,
    example: "email",
  })
  @Expose({ groups: ["me", "admin"] })
  provider: string;

  @ApiProperty({
    type: String,
    example: "1234567890",
  })
  @Expose({ groups: ["me", "admin"] })
  socialId?: string | null;

  @ApiProperty({
    type: String,
    example: "John",
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: "Doe",
  })
  lastName: string | null;

  @ApiProperty({
    type: () => FileType,
  })
  photo?: FileType | null;

  @ApiProperty({
    enum: ERole,
    enumName: "ERole",
    default: ERole.Employee,
  })
  role: ERole;

  @ApiProperty({
    enum: EEmployeeStatus,
    enumName: "EEmployeeStatus",
    default: EEmployeeStatus.Active,
  })
  status: EEmployeeStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}

import { Exclude, Expose } from "class-transformer";
import { FileType } from "../../../../common/files/domain/file";
import { ApiProperty } from "@nestjs/swagger";
import { ERole } from "../../../../enums/roles.enum";

export class Admin {
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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}

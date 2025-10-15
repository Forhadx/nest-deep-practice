import { PartialType, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, MinLength } from "class-validator";
import { FileDto } from "../../../../common/files/dto/file.dto";
import { lowerCaseTransformer } from "../../../../utils/transformers/lower-case.transformer";
import { CreateEmployeeDto } from "./create-employee.dto";
import { EEmployeeStatus } from "../../../../enums/employeeStatus.enum";

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @ApiPropertyOptional({ example: "test1@example.com", type: String })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiPropertyOptional({ example: "John", type: String })
  @IsOptional()
  firstName?: string | null;

  @ApiPropertyOptional({ example: "Doe", type: String })
  @IsOptional()
  lastName?: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({ enum: EEmployeeStatus, enumName: "EEmployeeStatus" })
  @IsEnum(EEmployeeStatus)
  // @IsOptional()
  status: EEmployeeStatus;
}

import { Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from "class-validator";
import { FileDto } from "../../../../common/files/dto/file.dto";
import { lowerCaseTransformer } from "../../../../utils/transformers/lower-case.transformer";
import { EEmployeeStatus } from "../../../../enums/employeeStatus.enum";

export class CreateEmployeeDto {
  @ApiProperty({ example: "test1@example.com", type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: "John", type: String })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: "Doe", type: String })
  @IsNotEmpty()
  lastName: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({ enum: EEmployeeStatus, enumName: "EEmployeeStatus" })
  @IsEnum(EEmployeeStatus)
  // @IsOptional()
  status: EEmployeeStatus;
}

import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { lowerCaseTransformer } from "../../../../utils/transformers/lower-case.transformer";

export class CreateAdminDto {
  @ApiProperty({ example: "test1@example.com", type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: "John", type: String })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: "Doe", type: String })
  @IsNotEmpty()
  lastName: string | null;
}

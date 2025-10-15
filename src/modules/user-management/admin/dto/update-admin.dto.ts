import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, MinLength } from "class-validator";
import { FileDto } from "../../../../common/files/dto/file.dto";

export class UpdateAdminDto {
  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: "John", type: String })
  @IsOptional()
  firstName?: string | null;

  @ApiPropertyOptional({ example: "Doe", type: String })
  @IsOptional()
  lastName?: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;
}

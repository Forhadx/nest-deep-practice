import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Transform, Type, plainToInstance } from "class-transformer";
import { ERole } from "../../../../enums/roles.enum";
import { Employee } from "../domain/employee";

export class FilterEmployeeDto {
  @ApiPropertyOptional({
    enum: ERole,
    isArray: true,
    enumName: "ERole",
  })
  @IsOptional()
  @IsEnum(ERole, { each: true })
  roles?: ERole[] | null;
}

export class SortUserDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Employee;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryEmployeeDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterEmployeeDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterEmployeeDto)
  filters?: FilterEmployeeDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortUserDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortUserDto)
  sort?: SortUserDto[] | null;
}

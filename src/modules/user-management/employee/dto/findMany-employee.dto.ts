import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { Transform, Type, plainToInstance } from "class-transformer";
import { ERole } from "../../../../enums/roles.enum";
import { Employee } from "../domain/employee";

export class FilterEmployeeDto {
  @IsOptional()
  @IsEnum(ERole, { each: true })
  roles?: ERole[] | null;
}

export class SortUserDto {
  @Type(() => String)
  @IsString()
  orderBy: keyof Employee;

  @IsString()
  order: string;
}

export class findManyEmployeeDto {
  // @IsOptional()
  // @IsString()
  // values?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterEmployeeDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterEmployeeDto)
  filters?: FilterEmployeeDto | null;

  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortUserDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortUserDto)
  sort?: SortUserDto[] | null;
}

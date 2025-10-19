import { IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class PaginationQueryDto {
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
}

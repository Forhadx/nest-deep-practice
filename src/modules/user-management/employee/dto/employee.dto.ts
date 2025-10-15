import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class EmployeeDto {
  @ApiProperty({
    type: String,
    example: "userId",
  })
  @IsNotEmpty()
  id: string | number;
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "../../../decorators/roles.decorator";
import { ERole } from "../../../enums/roles.enum";
import { AuthGuard } from "@nestjs/passport";

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "../../../utils/dto/infinity-pagination-response.dto";
import { NullableType } from "../../../utils/types/nullable.type";
import { RolesGuard } from "../../../guards/roles.guard";
import { infinityPagination } from "../../../utils/infinity-pagination";
import { Employee } from "./domain/employee";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { QueryEmployeeDto } from "./dto/query-employee.dto";
import { EmployeeService } from "./employee.service";

@ApiBearerAuth()
@Roles(ERole.Admin)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiTags("Employee")
@Controller({
  path: "employee",
  version: "1",
})
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiCreatedResponse({
    type: Employee,
  })
  @SerializeOptions({
    groups: ["admin"],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateEmployeeDto): Promise<Employee> {
    return this.employeeService.create(createProfileDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Employee),
  })
  @SerializeOptions({
    groups: ["admin"],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryEmployeeDto,
  ): Promise<InfinityPaginationResponseDto<Employee>> {
    console.log("query: ", query);
    // GET /users?page=1&limit=10&filters={"roles":[{"id":1}]}&sort=[{"orderBy":"email","order":"asc"}]

    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.employeeService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiOkResponse({
    type: Employee,
  })
  @SerializeOptions({
    groups: ["admin"],
  })
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  findOne(@Param("id") id: Employee["id"]): Promise<NullableType<Employee>> {
    return this.employeeService.findById(id);
  }

  @ApiOkResponse({
    type: Employee,
  })
  @SerializeOptions({
    groups: ["admin"],
  })
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  update(
    @Param("id") id: Employee["id"],
    @Body() updateProfileDto: UpdateEmployeeDto,
  ): Promise<NullableType<Employee>> {
    return this.employeeService.update(id, updateProfileDto);
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: Employee["id"]): Promise<void> {
    return this.employeeService.remove(id);
  }
}

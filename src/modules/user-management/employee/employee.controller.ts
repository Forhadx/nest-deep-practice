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
  // SerializeOptions,
  // UnprocessableEntityException,
} from "@nestjs/common";
import { Roles } from "../../../decorators/roles.decorator";
import { ERole } from "../../../enums/roles.enum";
import { AuthGuard } from "@nestjs/passport";
// import { InfinityPaginationResponse } from "../../../utils/dto/infinity-pagination-response.dto";
import { RolesGuard } from "../../../guards/roles.guard";
// import { infinityPagination } from "../../../utils/infinity-pagination";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeService } from "./employee.service";
import { PaginationQueryDto } from "../../../utils/dto/pagination.dto";
// import { findManyEmployeeDto } from "./dto/findMany-employee.dto";

@Roles(ERole.Admin, ERole.Employee)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller({
  path: "employee",
  version: "1",
})
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateEmployeeDto) {
    return this.employeeService.create(createProfileDto);
  }

  @Post("fetch")
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Body() body: any, //findManyEmployeeDto,
    @Query() query: PaginationQueryDto,
  ) {
    console.log("query: ", query);

    // GET /users?page=1&limit=10&filters={"roles":[{"id":1}]}&sort=[{"orderBy":"email","order":"asc"}]

    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    // return infinityPagination(
    //   await this.employeeService.findManyWithPagination({
    //     filterOptions: query?.filters,
    //     sortOptions: query?.sort,
    //     paginationOptions: {
    //       page,
    //       limit,
    //     },
    //   }),
    //   { page, limit },
    // );

    const list = await this.employeeService.findMany({
      filterOptions: body?.filters,
      sortOptions: body?.sort,
      paginationOptions: {
        page,
        limit,
      },
    });

    return list;
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  findOne(@Param("id") id: string) {
    return this.employeeService.findById(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  update(@Param("id") id: string, @Body() updateProfileDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateProfileDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.employeeService.remove(id);
  }
}

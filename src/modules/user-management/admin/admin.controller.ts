import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  NotFoundException,
} from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
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
import { NullableType } from "../../../utils/types/nullable.type";
import { Admin } from "./domain/admin";
import { AdminService } from "./admin.service";
import { RolesGuard } from "../../../guards/roles.guard";

@ApiBearerAuth()
@Roles(ERole.Admin)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiTags("Admin")
@Controller({
  path: "admin",
  version: "1",
})
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiCreatedResponse({
    type: Admin,
  })
  @SerializeOptions({
    groups: ["admin"],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.create(createProfileDto);
  }

  @ApiOkResponse({
    type: Admin,
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
  async findOne(@Param("id") id: Admin["id"]): Promise<NullableType<Admin>> {
    const adminData = await this.adminService.findById(id);

    if (!adminData) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          user: "user not found",
        },
      });
    }

    // return adminData;
    return null;
  }

  @ApiOkResponse({
    type: Admin,
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
    @Param("id") id: Admin["id"],
    @Body() updateProfileDto: UpdateAdminDto,
  ): Promise<NullableType<Admin>> {
    return this.adminService.update(id, updateProfileDto);
  }
}

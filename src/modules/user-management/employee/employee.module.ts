import { Module } from "@nestjs/common";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { FilesModule } from "../../../common/files/files.module";
import { EmployeeEntity } from "./entities/employee.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [FilesModule, TypeOrmModule.forFeature([EmployeeEntity])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}

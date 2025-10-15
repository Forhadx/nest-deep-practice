import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { FilesModule } from "../../../common/files/files.module";
import { AdminEntity } from "./entities/admin.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [FilesModule, TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

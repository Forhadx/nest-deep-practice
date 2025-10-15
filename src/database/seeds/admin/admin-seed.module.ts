import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "../../../modules/user-management/admin/entities/admin.entity";
import { AdminSeedService } from "./admin-seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  providers: [AdminSeedService],
  exports: [AdminSeedService],
})
export class AdminSeedModule {}

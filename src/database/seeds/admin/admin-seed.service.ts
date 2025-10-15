import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { ERole } from "../../../enums/roles.enum";
import { AdminEntity } from "../../../modules/user-management/admin/entities/admin.entity";

@Injectable()
export class AdminSeedService {
  constructor(
    @InjectRepository(AdminEntity)
    private repository: Repository<AdminEntity>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        email: "admin@gmail.com",
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash("123456", salt);

      await this.repository.save(
        this.repository.create({
          firstName: "Super",
          lastName: "Admin",
          email: "admin@gmail.com",
          password,
          role: ERole.Admin,
        }),
      );
    }

    const backupAdmin = await this.repository.count({
      where: {
        email: "admin@xoilion.com",
      },
    });

    if (!backupAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash("123456", salt);

      await this.repository.save(
        this.repository.create({
          firstName: "John",
          lastName: "Doe",
          email: "admin@xoilion.com",
          password,
          role: ERole.Admin,
        }),
      );
    }
  }
}

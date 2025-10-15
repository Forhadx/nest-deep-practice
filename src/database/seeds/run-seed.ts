import { NestFactory } from "@nestjs/core";
import { SeedModule } from "./seed.module";
import { AdminSeedService } from "./admin/admin-seed.service";

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(AdminSeedService).run();

  await app.close();
};

void runSeed();

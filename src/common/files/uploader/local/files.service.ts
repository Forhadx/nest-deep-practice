import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "../../../../config/config.type";
import { FileType } from "../../domain/file";
import { FilesService } from "../../files.service";

@Injectable()
export class FilesLocalService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly filesService: FilesService,
  ) {}

  async create(file: Express.Multer.File): Promise<{ file: FileType }> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: "selectFile",
        },
      });
    }

    return {
      file: await this.filesService.create({
        path: `/${this.configService.get("app.apiPrefix", {
          infer: true,
        })}/v1/${file.path}`,
      } as FileType),
    };
  }
}

import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { FileType } from "../../domain/file";
import type { File as MulterS3File } from "multer-s3";
import { FilesService } from "../../files.service";

@Injectable()
export class FilesS3Service {
  constructor(private readonly filesService: FilesService) {}

  async create(file: MulterS3File): Promise<{ file: FileType }> {
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
        path: file.key,
      } as FileType),
    };
  }
}

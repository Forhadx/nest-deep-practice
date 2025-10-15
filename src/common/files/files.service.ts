import { Injectable } from "@nestjs/common";
import { FileType } from "./domain/file";
import { NullableType } from "../../utils/types/nullable.type";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { FileEntity } from "./entities/file.entity";
import { FileMapper } from "./mappers/file.mapper";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async create(data: FileType): Promise<FileType> {
    const persistenceModel = FileMapper.toPersistence(data);
    return this.fileRepository.save(
      this.fileRepository.create(persistenceModel),
    );
  }

  async findById(id: FileType["id"]): Promise<NullableType<FileType>> {
    const entity = await this.fileRepository.findOne({
      where: {
        id: id,
      },
    });

    return entity ? FileMapper.toDomain(entity) : null;
  }

  async findByIds(ids: FileType["id"][]): Promise<FileType[]> {
    const entities = await this.fileRepository.find({
      where: {
        id: In(ids),
      },
    });

    return entities.map((entity) => FileMapper.toDomain(entity));
  }
}

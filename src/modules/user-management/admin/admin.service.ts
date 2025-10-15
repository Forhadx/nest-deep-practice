import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { NullableType } from "../../../utils/types/nullable.type";
import { Admin } from "./domain/admin";
import bcrypt from "bcryptjs";
import { FilesService } from "../../../common/files/files.service";
import { FileType } from "../../../common/files/domain/file";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "./entities/admin.entity";
import { In, Repository } from "typeorm";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { AdminMapper } from "./mappers/admin.mapper";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly filesService: FilesService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    let password: string | undefined = undefined;

    if (createAdminDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createAdminDto.password, salt);
    }

    let email: string | null = null;

    if (createAdminDto.email) {
      const userObject = await this.findByEmail(email);
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: "emailAlreadyExists",
          },
        });
      }
      email = createAdminDto.email;
    }

    const persistenceModel = AdminMapper.toPersistence({
      firstName: createAdminDto?.firstName,
      lastName: createAdminDto?.lastName,
      email: email,
      password: password,
    } as Admin);

    const newEntity = await this.adminRepository.save(
      this.adminRepository.create(persistenceModel),
    );

    return AdminMapper.toDomain(newEntity);
  }

  async findById(id: Admin["id"]): Promise<NullableType<Admin>> {
    const entity = await this.adminRepository.findOne({
      where: { id: id },
    });

    console.log("entity: ", entity);

    return entity ? AdminMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Admin["id"][]): Promise<Admin[]> {
    const entities = await this.adminRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((user) => AdminMapper.toDomain(user));
  }

  async findByEmail(email: Admin["email"]): Promise<NullableType<Admin>> {
    if (!email) return null;

    const entity = await this.adminRepository.findOne({
      where: { email },
    });

    return entity ? AdminMapper.toDomain(entity) : null;
  }

  async update(
    id: Admin["id"],
    updateUserDto: UpdateAdminDto,
  ): Promise<Admin | null> {
    let password: string | undefined = undefined;

    if (updateUserDto.password) {
      const userObject = await this.findById(id);

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let photo: FileType | null | undefined = undefined;

    if (updateUserDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        updateUserDto.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: "imageNotExists",
          },
        });
      }
      photo = fileObject;
    } else if (updateUserDto.photo === null) {
      photo = null;
    }

    const payload = {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      password,
      photo,
    } as Admin;

    const entity = await this.adminRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new Error("User not found");
    }

    const updatedEntity = await this.adminRepository.save(
      this.adminRepository.create(
        AdminMapper.toPersistence({
          ...AdminMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AdminMapper.toDomain(updatedEntity);
  }
}

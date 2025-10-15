import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { NullableType } from "../../../utils/types/nullable.type";
import { FilterEmployeeDto, SortUserDto } from "./dto/query-employee.dto";
import bcrypt from "bcryptjs";
import { AuthProvidersEnum } from "../auth/auth-providers.enum";
import { FilesService } from "../../../common/files/files.service";
import { IPaginationOptions } from "../../../utils/types/pagination-options";
import { FileType } from "../../../common/files/domain/file";
import { InjectRepository } from "@nestjs/typeorm";
import { EmployeeEntity } from "./entities/employee.entity";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { Employee } from "./domain/employee";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeMapper } from "./mappers/employee.mapper";

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    private readonly filesService: FilesService,
  ) {}

  async create(createUserDto: CreateEmployeeDto): Promise<Employee> {
    let password: string | undefined = undefined;

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createUserDto.password, salt);
    }

    let email: string | null = null;

    if (createUserDto.email) {
      const userObject = await this.findByEmail(email);
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: "emailAlreadyExists",
          },
        });
      }
      email = createUserDto.email;
    }

    let photo: FileType | null | undefined = undefined;

    if (createUserDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        createUserDto.photo.id,
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
    } else if (createUserDto.photo === null) {
      photo = null;
    }

    const persistenceModel = EmployeeMapper.toPersistence({
      firstName: createUserDto?.firstName,
      lastName: createUserDto?.lastName,
      email: email,
      password: password,
      photo: photo,
      // role: createUserDto?.role,
      status: createUserDto?.status,
      provider: createUserDto?.provider ?? AuthProvidersEnum.email,
      socialId: createUserDto?.socialId,
    } as Employee);

    const newEntity = await this.employeeRepository.save(
      this.employeeRepository.create(persistenceModel),
    );

    return EmployeeMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterEmployeeDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Employee[]> {
    const where: FindOptionsWhere<EmployeeEntity> = {};
    // if (filterOptions?.roles?.length) {
    //   where.role = filterOptions.roles.map((role) => ({
    //     id: role.id,
    //   }));
    // }

    if (filterOptions?.roles?.length) {
      where.role = In(filterOptions.roles);
    }

    const order = sortOptions?.reduce(
      (accumulator, sort) => ({
        ...accumulator,
        [sort.orderBy]: sort.order,
      }),
      {},
    );

    const entities = await this.employeeRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where, //  { role: [ { id: 1 } ] }
      order: order, //{ email: 'asc' }
    });

    return entities.map((user) => EmployeeMapper.toDomain(user));
  }

  async findById(id: Employee["id"]): Promise<NullableType<Employee>> {
    const entity = await this.employeeRepository.findOne({
      where: { id: id },
    });

    // console.log("entity: ", entity);

    return entity ? EmployeeMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Employee["id"][]): Promise<Employee[]> {
    const entities = await this.employeeRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((user) => EmployeeMapper.toDomain(user));
  }

  async findByEmail(email: Employee["email"]): Promise<NullableType<Employee>> {
    if (!email) return null;

    const entity = await this.employeeRepository.findOne({
      where: { email },
    });

    return entity ? EmployeeMapper.toDomain(entity) : null;
  }

  async update(
    id: Employee["id"],
    updateUserDto: UpdateEmployeeDto,
  ): Promise<Employee | null> {
    let password: string | undefined = undefined;

    if (updateUserDto.password) {
      const userObject = await this.findById(id);

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | null | undefined = undefined;

    if (updateUserDto.email) {
      const userObject = await this.findByEmail(updateUserDto.email);

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: "emailAlreadyExists",
          },
        });
      }

      email = updateUserDto.email;
    } else if (updateUserDto.email === null) {
      email = null;
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
      email,
      password,
      photo,
      status: updateUserDto?.status,
      provider: updateUserDto.provider,
      socialId: updateUserDto.socialId,
    } as Employee;

    const entity = await this.employeeRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new Error("User not found");
    }

    const updatedEntity = await this.employeeRepository.save(
      this.employeeRepository.create(
        EmployeeMapper.toPersistence({
          ...EmployeeMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return EmployeeMapper.toDomain(updatedEntity);
  }

  async remove(id: Employee["id"]): Promise<void> {
    await this.employeeRepository.softDelete(id);
  }
}

import { FileEntity } from "../../../../common/files/entities/file.entity";
import { FileMapper } from "../../../../common/files/mappers/file.mapper";
import { Employee } from "../domain/employee";
import { EmployeeEntity } from "../entities/employee.entity";

export class EmployeeMapper {
  static toDomain(raw: EmployeeEntity): Employee {
    const domainEntity = new Employee();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    if (raw.photo) {
      domainEntity.photo = FileMapper.toDomain(raw.photo);
    }
    domainEntity.role = raw.role;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Employee): EmployeeEntity {
    const persistenceEntity = new EmployeeEntity();
    if (domainEntity.id && typeof domainEntity.id === "string") {
      persistenceEntity.id = domainEntity.id;
    }

    let photo: FileEntity | undefined | null = undefined;
    if (domainEntity.photo) {
      photo = new FileEntity();
      photo.id = domainEntity.photo.id;
      photo.path = domainEntity.photo.path;
    } else if (domainEntity.photo === null) {
      photo = null;
    }

    persistenceEntity.email = domainEntity.email;
    persistenceEntity.password = domainEntity.password;
    persistenceEntity.firstName = domainEntity.firstName;
    persistenceEntity.lastName = domainEntity.lastName;

    persistenceEntity.photo = photo;
    persistenceEntity.role = domainEntity.role;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}

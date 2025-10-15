import { Session } from "../domain/session";
import { SessionEntity } from "../entities/session.entity";

export class SessionMapper {
  static toDomain(raw: SessionEntity): Session {
    const domainEntity = new Session();
    domainEntity.id = raw.id;
    domainEntity.userId = raw.userId;
    domainEntity.role = raw.role;
    domainEntity.hash = raw.hash;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Session): SessionEntity {
    const persistenceEntity = new SessionEntity();
    if (domainEntity.id && typeof domainEntity.id === "string") {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.userId = domainEntity.userId;
    persistenceEntity.role = domainEntity.role;
    persistenceEntity.hash = domainEntity.hash;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    return persistenceEntity;
  }
}

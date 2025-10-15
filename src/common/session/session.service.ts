import { Injectable } from "@nestjs/common";
import { Session } from "./domain/session";
import { NullableType } from "../../utils/types/nullable.type";
import { Not, Repository } from "typeorm";
import { SessionEntity } from "./entities/session.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { SessionMapper } from "./mappers/session.mapper";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async findById(id: Session["id"]): Promise<NullableType<Session>> {
    const entity = await this.sessionRepository.findOne({
      where: {
        id: id,
      },
    });

    return entity ? SessionMapper.toDomain(entity) : null;
  }

  create(
    data: Omit<Session, "id" | "createdAt" | "updatedAt" | "deletedAt">,
  ): Promise<Session> {
    const persistenceModel = SessionMapper.toPersistence(data as Session);
    return this.sessionRepository.save(
      this.sessionRepository.create(persistenceModel),
    );
  }

  async update(
    id: Session["id"],
    payload: Partial<
      Omit<Session, "id" | "createdAt" | "updatedAt" | "deletedAt">
    >,
  ): Promise<Session | null> {
    const entity = await this.sessionRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new Error("Session not found");
    }

    const updatedEntity = await this.sessionRepository.save(
      this.sessionRepository.create(
        SessionMapper.toPersistence({
          ...SessionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SessionMapper.toDomain(updatedEntity);
  }

  async deleteById(id: Session["id"]): Promise<void> {
    await this.sessionRepository.softDelete({
      id: id,
    });
  }

  async deleteByUserId(conditions: { userId: string }): Promise<void> {
    await this.sessionRepository.softDelete({
      userId: conditions.userId,
    });
  }

  async deleteByUserIdWithExclude(conditions: {
    userId: string;
    excludeSessionId: Session["id"];
  }): Promise<void> {
    await this.sessionRepository.softDelete({
      userId: conditions.userId,
      id: Not(conditions.excludeSessionId),
    });
  }
}

import { Entity, Index, Column } from "typeorm";
import { AbstractBaseEntity } from "../../../utils/abstract-base.entity";
import { ERole } from "../../../enums/roles.enum";

@Entity({
  name: "session",
})
export class SessionEntity extends AbstractBaseEntity {
  @Column()
  @Index()
  userId: string;

  @Column()
  role: ERole;

  @Column()
  hash: string;
}

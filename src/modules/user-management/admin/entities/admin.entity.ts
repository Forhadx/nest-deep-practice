import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { FileEntity } from "../../../../common/files/entities/file.entity";
import { AbstractBaseEntity } from "../../../../utils/abstract-base.entity";
import { ERole } from "../../../../enums/roles.enum";

@Entity({
  name: "admin",
})
export class AdminEntity extends AbstractBaseEntity {
  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ nullable: true })
  password?: string;

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  photo?: FileEntity | null;

  @Column({
    type: "enum",
    enum: ERole,
    default: ERole.Admin,
  })
  role: ERole;
}

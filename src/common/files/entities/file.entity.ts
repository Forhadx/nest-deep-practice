import {
  // typeorm decorators here
  Column,
  Entity,
} from "typeorm";
import { AbstractBaseEntity } from "../../../utils/abstract-base.entity";

@Entity({ name: "file" })
export class FileEntity extends AbstractBaseEntity {
  @Column()
  path: string;
}

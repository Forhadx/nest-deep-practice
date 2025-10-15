import { ERole } from "../../../enums/roles.enum";

export class Session {
  id: string;
  userId: string;
  role: ERole;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

import { Session } from "../../../../../common/session/domain/session";
import { Admin } from "../../../admin/domain/admin";
import { Employee } from "../../../employee/domain/employee";

export type JwtPayloadType = Pick<Admin | Employee, "id" | "role"> & {
  sessionId: Session["id"];
  iat: number;
  exp: number;
};

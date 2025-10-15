import { Session } from "../../../../../common/session/domain/session";

export type JwtRefreshPayloadType = {
  sessionId: Session["id"];
  hash: Session["hash"];
  iat: number;
  exp: number;
};

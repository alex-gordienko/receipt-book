import { checkUserAccess } from "./checkUserAccess.middleware";
import { parseBearerToken } from "./parseToken.middleware";
import { safeExecuteRoute } from "./safeExecuteRoute.middleware";


export const middlewareHub = {
  safeExecute: safeExecuteRoute,
  parseToken: parseBearerToken,
  checkPermissions: checkUserAccess
}
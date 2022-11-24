import { Router } from 'express';
import { parseBearerToken } from '../../middlewares/parseToken.middleware';
import { checkUserAccess } from '../../middlewares/checkUserAccess.middleware';
import { userController } from './user.controller';
import { safeExecuteRoute } from '../../middlewares/safeExecuteRoute.middleware';

export const userRoutes = (
): Router => {
  const user: Router = Router({ mergeParams: true });

  user.get('/', safeExecuteRoute(parseBearerToken(checkUserAccess(userController.getUser))));

  user.post('/', safeExecuteRoute(userController.login));
  
  user.post('/create', safeExecuteRoute(userController.createUser));

  user.put('/edit', safeExecuteRoute(parseBearerToken(checkUserAccess(userController.editUser))));

  user.delete('/delete', safeExecuteRoute(parseBearerToken(checkUserAccess(userController.deleteUser))));

  return user;
}
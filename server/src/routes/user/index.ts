import { Router } from 'express';
import { safeExecuteRoute } from '../../helpers/responses';
import { parseBearerToken } from '../../middlewares/parseToken';
import { userController } from './user.controller';

export const userRoutes = (
): Router => {
  const user: Router = Router({ mergeParams: true });

  user.get('/', safeExecuteRoute(parseBearerToken(userController.getUser)));

  user.post('/', safeExecuteRoute(userController.login));
  
  user.post('/create', safeExecuteRoute(userController.createUser));

  user.put('/edit', safeExecuteRoute(parseBearerToken(userController.editUser)));

  user.delete('/delete', safeExecuteRoute(parseBearerToken(userController.deleteUser)));

  return user;
}
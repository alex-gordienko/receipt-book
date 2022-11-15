import { RequestHandler } from "express";
import { WithId } from "mongodb";
import { validateCreateUser, validateEditUser } from "./user.validator";
import { userServices } from './user.services';
import { unauthorized } from "../../helpers/responses";


type Login = RequestHandler<{}, {token: string}, user.IAuthorizeData, {}>;
type GetUser = RequestHandler<{}, WithId<user.IUser>, {token: string}, {}>;
type CreateUser = RequestHandler<{},{token: string}, user.ICreateUser, {}>;
type EditUser = RequestHandler<{}, WithId<user.IUser>, user.IEditUser, {}>;
type DeleteUser = RequestHandler<{}, WithId<user.IUser>, user.IAuthorizeData, {}>;

class UserController {

  public login: Login = async (req, res) => {
    const token = await userServices.login(req.body.login, req.body.pass);
    res.send(token)
  }

  public getUser: GetUser = async (req, res) => {
    if (!req.user?.id) {
      throw unauthorized('Can\'t find user token');
    }

    const user = await userServices.getUserData(req.user.id);
    res.send(user)
  }

  public createUser: CreateUser = async (req, res) => {
    await validateCreateUser(req.body);

    const userAccount = await userServices.createAccount(req.body);
    res.send(userAccount);
  }

  public editUser: EditUser = async (req, res) => {
    await validateEditUser(req.body);

    if (!req.user?.id) {
      throw unauthorized('Can\'t find user token');
    }

    const updatedUser = await userServices.editUser(req.user.id, req.body);
    res.send(updatedUser)
  }

  public deleteUser: DeleteUser = async (req, res) => {
    if (!req.user?.id) {
      throw unauthorized('Can\'t find user token');
    }

    const deleteResult = await userServices.deleteUser(req.user.id);

    res.send(deleteResult)
  }
}

export const userController = new UserController();
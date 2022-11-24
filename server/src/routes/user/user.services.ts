import { ObjectId, WithId } from "mongodb";
import { createHash } from "../../helpers/decriptor";
import { useDatabase } from "../../hooks/useDatabase";
import { userModel } from './user.models';
import * as jwt from "jsonwebtoken";
import { secret } from "../../config";

class UserServices {
  public login = async (login: string, password: string): Promise<{token: string}> => {
    const userDBSalt = await userModel.getUserSaltWithCheck(login);

    const saltedHashPass = createHash(password, userDBSalt.salt);

    const accountData = await userModel.getDataFromAccountDB({ login, saltedHashPass });

    const token = jwt.sign({ id: accountData._id.toString() }, secret, { expiresIn: 60*60, algorithm: 'RS256' })
    return {
      token
    }
  }

  public getUserData = async (accountId: string): Promise<WithId<user.IUser> & { userPrivateId: ObjectId }> => {
    try {
      const userAccountId = new ObjectId(accountId);

      const accountData = await userModel.getDataFromAccountDB({_id: userAccountId});

      const userData = await userModel.getDataFromUsersDB(accountData._id);

      return {
        _id: accountData._id,
        login: accountData.login,
        userPrivateId: userData._id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        phone: userData.phone,
        email: userData.email,
        status: accountData.status,
        isAdmin: accountData.isAdmin
      }
    } catch (error) {
      console.error(error);
      return this.getDeletedAccount(accountId);
    }
  }

  public getDeletedAccount = async (accountId: string): Promise<WithId<user.IUser> & { userPrivateId: ObjectId }> => {
    try {
      const userAccountId = new ObjectId(accountId);

      const deletedUserAccount = await userModel.getDataFromAccountDB({_id: userAccountId});
      return {
        _id: deletedUserAccount._id,
        status: deletedUserAccount.status,
        login: deletedUserAccount.login,
        firstname: 'DELETED',
        lastname: 'DELETED',
        email: 'DELETED',
        phone: 'DELETED',
        userPrivateId: new ObjectId(),
        isAdmin: false
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  public createAccount = async (userData: user.ICreateUser): Promise<{token: string}> => {
    const userHash = await userModel.createUserSalt(userData.login);

    const hashedSaltedPassword = createHash(userData.pass, userHash.salt);

    const userAccount = await useDatabase.accountsDatabase.insertOne({
      login: userHash.login,
      saltedHashPass: hashedSaltedPassword,
      status: 'active',
      isAdmin: userData.isAdmin
    })

    await useDatabase.usersDatabase.insertOne({
      firstname: userData.firstname,
      lastname: userData.lastname,
      phone: userData.phone,
      email: userData.email,
      userAccountId: userAccount.insertedId
    });

    const token = jwt.sign({ id: userAccount.insertedId.toString() }, secret, { expiresIn: 60*60, algorithm: 'RS256' })
    return {
      token
    }
  }

  public editUser = async (accountId: string, updatedUserData: user.IEditUser): Promise<WithId<user.IUser> & {userPrivateId: ObjectId}> => {

    let userDBSalt = await userModel.getUserSaltWithCheck(updatedUserData.oldLogin);

    const existedUser = await this.getUserData(accountId);

    const dataToUpdate: user.ICreateUser = {
      login: updatedUserData.oldLogin,
      pass: createHash(updatedUserData.oldPass, userDBSalt.salt),
      firstname: updatedUserData.firstname || existedUser.firstname,
      lastname: updatedUserData.lastname || existedUser.lastname,
      phone: updatedUserData.phone || existedUser.phone,
      email: updatedUserData.email || existedUser.email,
      isAdmin: updatedUserData.isAdmin || existedUser.isAdmin
    };

    if (updatedUserData.login && updatedUserData.login !== updatedUserData.oldLogin) {
      userDBSalt = await userModel.updateUserSalt(updatedUserData.login, userDBSalt.login, userDBSalt.salt);

      dataToUpdate.login = updatedUserData.login;
    }

    if (updatedUserData.pass) {
      const saltedHashPass = createHash(updatedUserData.pass, userDBSalt.salt);
      dataToUpdate.pass = saltedHashPass;
    }

    if (updatedUserData.oldPass !== updatedUserData.pass || updatedUserData.oldLogin !== updatedUserData.login) {
      await userModel.updateAccountData(existedUser._id, dataToUpdate.login, dataToUpdate.pass);
    }

    if (updatedUserData.firstname !== existedUser.firstname || updatedUserData.lastname !== existedUser.lastname) {
      await userModel.updateUserData(existedUser.userPrivateId, dataToUpdate.firstname, dataToUpdate.lastname);
    }

    return {
      _id: existedUser._id,
      userPrivateId: existedUser.userPrivateId,
      login: dataToUpdate.login,
      firstname: dataToUpdate.firstname,
      lastname: dataToUpdate.lastname,
      status: existedUser.status,
      phone: dataToUpdate.phone,
      email: dataToUpdate.email,
      isAdmin: dataToUpdate.isAdmin
    }
  }

  public deleteUser = async (userId: string) => {
    const _id = new ObjectId(userId);
    await userModel.deleteUserAccount(_id);

    return this.getDeletedAccount(userId)
  }
}

export const userServices = new UserServices()
import { ObjectId, WithId } from "mongodb";
import { generateSalt } from "../../helpers/decriptor";
import { notFound, conflict } from "../../helpers/responses";
import { useDatabase } from "../../hooks/useDatabase";

type IGetDataFromAccountDB = { login: string, saltedHashPass: string } | { _id: ObjectId };

const isSearchingById = (data: IGetDataFromAccountDB): data is { _id: ObjectId } => (data as { _id: ObjectId })._id !== undefined;

class UserModel {

  private getUserSalt = async (login: string): Promise<WithId<user.ILoginSaltPair> | null> => {
    return useDatabase.saltDatabase.findOne({ login });
  }

  public getUserSaltWithCheck = async (login: string): Promise<WithId<user.ILoginSaltPair>> => {
    const userSalt = await this.getUserSalt(login);

    if (!userSalt) {
      throw notFound('User salt is not exist');
    }
    return userSalt
  }
  
  public getDataFromAccountDB = async (data: IGetDataFromAccountDB): Promise<WithId<user.IAccountDB>> => {
    if (isSearchingById(data)) {
      const account = await useDatabase.accountsDatabase.findOne({ _id: data._id });

      if (!account) {
        throw notFound('Can\'t find user with this credentials')
      }
      return account
    }

    const account = await useDatabase.accountsDatabase.findOne({ login: data.login, saltedHashPass: data.saltedHashPass });

    if (!account) {
      throw notFound('Can\'t find user with this credentials')
    }
    return account
  }

  public getDataFromUsersDB = async (userAccountId: ObjectId): Promise<WithId<user.IUserDB>> => {
    const user = await useDatabase.usersDatabase.findOne({ userAccountId });

    if (!user) {
      throw notFound('User has been deleted')
    }
    return user
  }

  public createUserSalt = async (login: string): Promise<WithId<user.ILoginSaltPair>> => {
    const salt = generateSalt(login);

    const isUserSaltExists = await this.getUserSalt(login);
    if (isUserSaltExists) {
      throw conflict('User with this login is exists');
    }

    const created = await useDatabase.saltDatabase.insertOne({ login, salt });

    return (await useDatabase.saltDatabase.findOne({ _id: created.insertedId }))!;
  }

  public updateUserSalt = async (newLogin: string, oldLogin: string, oldSalt: string): Promise<WithId<user.ILoginSaltPair>> => {
    await useDatabase.saltDatabase.deleteOne({ login: oldLogin, salt: oldSalt });

    return this.createUserSalt(newLogin);
  }

  public updateAccountData = (id: ObjectId, login: string, saltedHashPass: string) => {
    return useDatabase.accountsDatabase.updateOne({ _id: id }, { $set: { login, saltedHashPass } })
  }

  public updateUserData = async (id: ObjectId, firstname: string, lastname: string) => {
    return useDatabase.usersDatabase.updateOne({ _id: id }, { $set: { firstname, lastname } })
  }

  public deleteUserSalt = async (login: string) => {
    const existedSalt = await this.getUserSaltWithCheck(login);
    await useDatabase.saltDatabase.deleteOne({ login: existedSalt.login });
    return existedSalt
  }

  public deleteUserAccount = async (_id: ObjectId) => {

    const existedAccount = await this.getDataFromAccountDB({ _id });

    await this.deleteUserSalt(existedAccount.login);

    const existedUser = await this.getDataFromUsersDB(existedAccount._id);

    await useDatabase.accountsDatabase.updateOne({ _id: existedUser.userAccountId }, { $set: { status: 'deleted' } });

    await useDatabase.usersDatabase.deleteOne({ _id: existedUser._id });
  }
}

export const userModel = new UserModel();
declare namespace user {
  interface ILoginSaltPair {
    login: string;
    salt: string;
  }

  interface IAuthorizeData {
    login: string;
    pass: string;
  }

  interface IAccountDB {
    login: string;
    saltedHashPass: string;
    status: 'active' | 'deleted';
    isAdmin: boolean;
  }

  interface IUserDB {
    userAccountId: ObjectId;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
  }

  interface IUser extends
    Omit<IAccountDB, 'saltedHashPass'>,
    Pick<IUserDB, 'firstname' | 'lastname' | 'phone' | 'email'>
  { }

  interface ICreateUser extends
    IAuthorizeData,
    Pick<IUserDB, 'firstname' | 'lastname' | 'phone' | 'email'>
  {
    isAdmin: boolean;
  }

  interface IEditUser extends
    Partial<IAuthorizeData>,
    Partial<Pick<IUserDB, 'firstname' | 'lastname' | 'phone' | 'email'>>
  {
    oldLogin: string;
    oldPass: string;
    isAdmin?: boolean;
  }
}
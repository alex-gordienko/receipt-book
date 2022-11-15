import Joi from "joi";
import { createHash } from "../../helpers/decriptor";
import { badRequest, notFound, validationError } from "../../helpers/responses";
import { useDatabase } from "../../hooks/useDatabase";

export const createUserSchema = Joi.object<user.ICreateUser>({
  login: Joi.string().required(),
  pass: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required()
});

export const editUserSchema = Joi.object<user.IEditUser>({
  oldLogin: Joi.string().required(),
  login: Joi.string().optional(),
  oldPass: Joi.string().required(),
  pass: Joi.string().optional(),
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  phone: Joi.string().optional(),
  email: Joi.string().optional()
});

export const deleteUserSchema = Joi.object<user.IAuthorizeData>({
  login: Joi.string().required(),
  pass: Joi.string().required()
})

export const validateCreateUser = async (reqBody: user.ICreateUser): Promise<boolean> => {
  const validationResult = await createUserSchema.validate(reqBody);

  if (validationResult.error) {
    throw validationError(validationResult.error?.details);
  }

  return true
}

export const validateEditUser = async (reqBody: user.IEditUser): Promise<boolean> => {
  const validationResult = await editUserSchema.validate(reqBody);

  if (validationResult.error) {
    throw validationError(validationResult.error?.details);
  }

  const userSalt = await useDatabase.saltDatabase.findOne({ login: reqBody.oldLogin });

  if (!userSalt) {
    throw notFound('User not found');
  }

  const saltedHashPass = createHash(reqBody.oldPass, userSalt.salt);

  const account = await useDatabase.accountsDatabase.findOne({ login: reqBody.oldLogin, saltedHashPass });

  if (!account) {
    throw badRequest('Incorrect old password');
  }

  return true
}

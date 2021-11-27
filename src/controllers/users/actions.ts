import { IMiddleware } from 'koa-router';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { User } from '../../models/user';
import { AppContext } from '../../types';

const getUserValidationSchema = () => Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const getUsers: IMiddleware<{}, AppContext> = async (ctx) => {
  const documents = await User.find(ctx.query);

  return ctx.ok(documents);
};

export const createUser: IMiddleware<{}, AppContext> = async (ctx) => {
  const payload = ctx.request.body;

  const validationResult = getUserValidationSchema().validate(payload, { abortEarly: false });

  if (validationResult.error) throw validationResult.error;

  const passwordHash = await bcrypt.hash(payload.password, 10);

  const userDocument = await User.create({ ...payload, passwordHash });

  return ctx.ok(userDocument);
};

export default { getUsers, createUser };

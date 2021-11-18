import Joi from 'joi';
import { IMiddleware } from 'koa-router';
import { Account, accountModel } from '../../models/account';
import { AppContext } from '../../types';

const getAccountSchema = () => Joi.object<Account, false, Account>({
  name: Joi.string().required(),
  currency: Joi.string().uppercase().required(),
  balance: Joi.number(),
}).required();

// eslint-disable-next-line import/prefer-default-export
export const createAccount: IMiddleware<{}, AppContext> = async (ctx) => {
  const validationResult = getAccountSchema().validate(ctx.request.body, { abortEarly: false });
  if (validationResult.error) throw validationResult.error;

  const account = ctx.request.body as Account;

  const count = await accountModel.countDocuments({ name: account.name });
  if (count) throw new Joi.ValidationError(`Account with same name exists: ${account.name}`, [], undefined);

  return ctx.json(await accountModel.create(account));
};

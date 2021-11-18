import Joi from 'joi';
import { IMiddleware } from 'koa-router';
import { RespondContext } from './respond';

// eslint-disable-next-line import/prefer-default-export
export const handleJoiError: IMiddleware<{}, RespondContext> = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof Joi.ValidationError) {
      ctx.badRequest({ error: e.message, details: e.details });
    } else {
      throw e;
    }
  }
};

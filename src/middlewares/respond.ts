import { Middleware } from 'koa';

export type Handler = (body?: unknown) => void;
export type EmptyHandler = () => void;

export interface RespondContext {
  ok: Handler;
  json: Handler;
  created: Handler;
  badRequest: Handler;
  notFound: EmptyHandler;
}

export const respond = (): Middleware<{}, RespondContext> => (ctx, next) => {
  ctx.ok = function ok(body) {
    ctx.body = body;
  };

  ctx.json = function json(body) {
    ctx.body = body;
    ctx.set('Content-Type', 'application/json');
  };

  ctx.created = function created(body) {
    ctx.status = 201;
    ctx.body = body;
  };

  ctx.badRequest = function badRequest(body) {
    ctx.status = 400;
    ctx.body = body;
  };

  ctx.notFound = function notFound() {
    ctx.status = 404;
  };

  return next();
};

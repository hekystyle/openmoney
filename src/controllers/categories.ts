import { IMiddleware } from 'koa-router';
import { Category, categorySchema, isCategory } from '../models/category';
import { AppContext } from '../types';

function getRepository(ctx: AppContext) {
  return ctx.db.model<Category>('category', categorySchema);
}

export const getAll: IMiddleware<{}, AppContext> = async (ctx) => {
  const repo = getRepository(ctx);

  const cats = await repo.find();

  return ctx.ok(cats);
};

export const getOne: IMiddleware<{}, AppContext> = async (ctx) => {
  const { id } = ctx.params;

  const repo = getRepository(ctx);
  const cat = await repo.findById(id);

  if (!cat) return ctx.notFound();

  return ctx.ok(cat);
};

export const create: IMiddleware<{}, AppContext> = async (ctx) => {
  const payload = ctx.request.body;

  if (!isCategory(payload)) return ctx.badRequest();

  const template: Category = {
    name: payload.name,
  };

  const repo = getRepository(ctx);
  const cat = await repo.create(template);

  return ctx.created(cat);
};

export const update: IMiddleware<{}, AppContext> = async (ctx) => {
  const { id } = ctx.params;
  const payload = ctx.request.body;

  if (!isCategory(payload)) return ctx.badRequest();

  const repo = getRepository(ctx);
  const cat = await repo.findByIdAndUpdate(id, payload, { new: true });

  if (!cat) return ctx.notFound();

  return ctx.ok(cat);
};

export const del: IMiddleware<{}, AppContext> = async (ctx) => {
  const { id } = ctx.params;

  const repo = getRepository(ctx);

  const result = await repo.deleteOne({ _id: id });

  if (result.deletedCount === 0) return ctx.notFound();

  return ctx.ok();
};

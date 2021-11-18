import { IMiddleware } from 'koa-router';
import { Category, categorySchema } from '../../models/category';
import { AppContext } from '../../types';

function getRepository(ctx: AppContext) {
  return ctx.db.model<Category>('category', categorySchema);
}

export const getCategories: IMiddleware<{}, AppContext> = async (ctx) => {
  const repo = getRepository(ctx);

  const cats = await repo.find();

  return ctx.ok(cats);
};

export const getCategory: IMiddleware<{}, AppContext> = async (ctx) => {
  const { id } = ctx.params;

  const repo = getRepository(ctx);
  const cat = await repo.findById(id);

  if (!cat) return ctx.notFound();

  return ctx.ok(cat);
};

export const createCategory: IMiddleware<{}, AppContext> = async (ctx) => {
  const payload = ctx.request.body;

  // TODO: validate payload

  const template: Category = {
    name: payload.name,
  };

  const repo = getRepository(ctx);
  const cat = await repo.create(template);

  return ctx.created(cat);
};

export const updateCategory: IMiddleware<{}, AppContext> = async (ctx) => {
  const { id } = ctx.params;
  const payload = ctx.request.body;

  // TODO: validate payload

  const repo = getRepository(ctx);
  const cat = await repo.findByIdAndUpdate(id, payload, { new: true });

  if (!cat) return ctx.notFound();

  return ctx.ok(cat);
};

export const deleteCustomer: IMiddleware<{}, AppContext> = async (ctx) => {
  const { id } = ctx.params;

  const repo = getRepository(ctx);

  const result = await repo.deleteOne({ _id: id });

  if (result.deletedCount === 0) return ctx.notFound();

  return ctx.ok();
};

import { IMiddleware } from "koa-router";
import { v4 } from "uuid";
import { RespondContext } from "../middleware/respond";
import { Category, isCategory } from "../models/category";

const categories: Category[] = [];

export const getAll: IMiddleware<{}, RespondContext> = async (ctx) => {
  return ctx.ok(categories);
};

export const getOne: IMiddleware<{}, RespondContext> = async (ctx) => {
  const id = ctx.params.id;

  const cat = categories.find((c) => c.id === id);

  if (!cat) return ctx.notFound();

  return ctx.ok(cat);
};

export const create: IMiddleware<{}, RespondContext> = async (ctx) => {
  const payload = ctx.request.body;

  if (!isCategory(payload)) return ctx.badRequest();

  const cat: Category = {
    id: v4(),
    name: payload.name,
  };

  categories.push(cat);

  return ctx.created(cat);
};

export const update: IMiddleware<{}, RespondContext> = async (ctx) => {
  const id = ctx.params.id;
  const payload = ctx.request.body;

  if (!isCategory(payload)) return ctx.badRequest();

  const cat = categories.find((c) => c.id === id);

  if (!cat) return ctx.notFound();

  cat.name = payload.name;

  return ctx.ok(cat);
};

export const del: IMiddleware<{}, RespondContext> = async (ctx) => {
  const id = ctx.params.id;

  const idx = categories.findIndex((c) => c.id === id);

  if (idx === -1) return ctx.notFound();

  categories.splice(idx, 1);

  return ctx.ok();
};

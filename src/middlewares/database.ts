import { IMiddleware } from 'koa-router';
import mongoose, { Mongoose } from 'mongoose';

const DB_URI = 'mongodb://db:27017/openmoney';

let instance: Mongoose;

export interface DatabaseContext {
  db: Mongoose;
}

export function database(): IMiddleware<{}, DatabaseContext> {
  return async (ctx, next) => {
    if (!instance) {
      try {
        instance = await mongoose.connect(DB_URI);
      } catch {
        ctx.status = 503;
        return;
      }
    }
    ctx.db = instance;
    await next();
  };
}

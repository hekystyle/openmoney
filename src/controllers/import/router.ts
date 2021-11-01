import Router, { IMiddleware } from 'koa-router';
import csvParse, { CsvError } from 'csv-parse';
import util from 'util';
import stream from 'stream';
import { AppContext } from '../../types';
import toArray from '../../utils/stream/pipeline/toArray';
import { RespondContext } from '../../middlewares/respond';

const pipelineAsync = util.promisify(stream.pipeline);

const importAction: IMiddleware<{}, AppContext> = async (ctx) => {
  const rows = await pipelineAsync(
    ctx.req,
    csvParse({
      columns: [
      // TODO: add columns
      ],
    }),
    toArray(),
  );
  ctx.ok(rows);
};

const handleCsvError: IMiddleware<{}, RespondContext> = async (ctx, next) => {
  try {
    await next();
  } catch (e: unknown) {
    if (e instanceof CsvError) {
      ctx.badRequest({ code: e.code, message: e.message });
    } else {
      throw e;
    }
  }
};

const router = new Router<{}, AppContext>();

router.post('/', handleCsvError, importAction);

export default router;

import { DatabaseContext } from './middlewares/database';
import { RespondContext } from './middlewares/respond';

export type AppContext = RespondContext & DatabaseContext;

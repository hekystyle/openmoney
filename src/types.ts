import { DatabaseContext } from "./middleware/database";
import { RespondContext } from "./middleware/respond";

export type AppContext = RespondContext & DatabaseContext;

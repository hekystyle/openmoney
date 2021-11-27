import Router from 'koa-router';
import { handleJoiError } from '../../middlewares/handleJoiError';
import { AppContext } from '../../types';
import { createUser, getUsers } from './actions';

const usersRouter = new Router<{}, AppContext>();

usersRouter.get('/', getUsers);
usersRouter.post('/', handleJoiError, createUser);

export default usersRouter;

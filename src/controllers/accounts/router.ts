import Router from 'koa-router';
import { handleJoiError } from '../../middlewares/handleJoiError';
import { AppContext } from '../../types';
import { createAccount } from './actions';

const router = new Router<{}, AppContext>();

router.post('/', handleJoiError, createAccount);

export default router;

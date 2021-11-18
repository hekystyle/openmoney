import Router from 'koa-router';
import { AppContext } from '../../types';
import {
  createCategory, deleteCustomer, getCategories, getCategory, updateCategory,
} from './actions';

const router = new Router<{}, AppContext>();
router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCustomer);

export default router;

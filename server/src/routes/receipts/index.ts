import { Router } from 'express';
import { checkUserAccess } from '../../middlewares/checkUserAccess.middleware';
import { parseBearerToken } from '../../middlewares/parseToken.middleware';
import { safeExecuteRoute } from '../../middlewares/safeExecuteRoute.middleware';
import { receiptsController } from './receipts.controller';

export const receiptsRoutes = (
): Router => {
  const receipts: Router = Router({ mergeParams: true });

  receipts.get('/:id', safeExecuteRoute(parseBearerToken(checkUserAccess(receiptsController.getReceipt))));
  
  receipts.get('/list-by-category/:id', safeExecuteRoute(parseBearerToken(checkUserAccess(receiptsController.getReceiptsByCategory))));
  
  receipts.post('/create', safeExecuteRoute(checkUserAccess(parseBearerToken(receiptsController.createReceipt))));

  receipts.put('/edit/:id', safeExecuteRoute(checkUserAccess(parseBearerToken(receiptsController.editReceipt))));

  receipts.put('/like/:id', safeExecuteRoute(checkUserAccess(parseBearerToken(receiptsController.likeReceipt))));

  receipts.delete('/:id', safeExecuteRoute(checkUserAccess(parseBearerToken(receiptsController.deleteReceipt))));

  return receipts;
}
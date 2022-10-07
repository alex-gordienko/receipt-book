import { Router } from 'express';
import { safeExecuteRoute } from '../../helpers/responses';
import { receiptsController } from './receipts.controller';

export const receiptsRoutes = (
): Router => {
  const receipts: Router = Router({ mergeParams: true });

  receipts.get('/:id', safeExecuteRoute(receiptsController.getReceipt));
  
  receipts.get('/list-by-category/:id', safeExecuteRoute(receiptsController.getReceiptsByCategory));
  
  receipts.post('/create', safeExecuteRoute(receiptsController.createReceipt));

  receipts.put('/edit/:id', safeExecuteRoute(receiptsController.editReceipt));

  receipts.delete('/:id', safeExecuteRoute(receiptsController.deleteReceipt));

  return receipts;
}
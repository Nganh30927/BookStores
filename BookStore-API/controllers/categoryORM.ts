import { NextFunction, Request, Response } from 'express';
import { sendJsonSuccess } from '../helpers/responseHandler';
import categoryORM from '../services/categoryORM';

const getItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await categoryORM.getItemById(parseInt(req.params.id));
      sendJsonSuccess(res)(product);
    } catch (error) {
      next(error);
    }
  };

  export default {
  
    getItemById,
    
  };
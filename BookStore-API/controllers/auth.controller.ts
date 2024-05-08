import {Request, Response, NextFunction} from 'express'
import authService from '../services/auth.service'
import { sendJsonSuccess } from '../helpers/responseHandler';

const login = async(req:Request, res: Response, next: NextFunction)=>{
    try {
      /**
       * payload = {email, password}
       */
      const payload = req.body;
      console.log('Received login request with payload:', payload);
      const result = await authService.login(payload);
      console.log('<<=== 🚀 login result ===>>',payload,result);
      sendJsonSuccess(res)(result);
    } catch (error) {
      next(error)
    }
  }
  
  
  const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id, userType} = res.locals.user;
      console.log(`res.locals`,res.locals);
      const userProfile = await authService.getProfile(id, userType);
      sendJsonSuccess(res)(userProfile);
    } catch (error) {
      next(error)
    }
  };
  
  
  const freshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      const tokens = await authService.refreshToken(user);
      sendJsonSuccess(res)(tokens);
    } catch (error) {
      next(error)
    }
  };
  

  export default {
    login,
    getProfile,
    freshToken
  }
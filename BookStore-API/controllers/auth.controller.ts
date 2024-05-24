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
      //sendJsonSuccess(res)(result);
      res.status(200).json({
        message: 'success',
        token: result.token,
        freshToken: result.refreshToken
      })
    } catch (error) {
      next(error)
    }
  }
  //server chay o dau
  
  const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = res.locals.user;
      console.log(`res.locals`,res.locals);
      const userProfile = await authService.getProfile(id);
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
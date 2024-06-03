import {Request, Response, NextFunction} from 'express'
import memberService from '../services/auth.member.service'


const login = async(req:Request, res: Response, next: NextFunction)=>{
    try {
      /**
       * payload = {email, password}
       */
      const payload = req.body;
      console.log('Received login request with payload:', payload);
      const result = await memberService.login(payload);
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
  
  
  const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = res.locals.user;
      console.log(`res.locals`,res.locals);
      const userProfile = await memberService.getProfile(id);
       // sendJsonSuccess(res)(userProfile);
       res.status(200).json(userProfile)
    } catch (error) {
      next(error)
    }
  };
  
  
  const freshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      const tokens = await memberService.refreshToken(user);
        // sendJsonSuccess(res)(tokens);
        res.status(200).json(tokens)
    } catch (error) {
      next(error)
    }
  };
  

  export default {
    login,
    getProfile,
    freshToken
  }
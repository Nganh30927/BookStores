import {Request, Response, NextFunction} from 'express';
import createError from 'http-errors'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppDataSource } from '../data-source';
import { Employee } from '../entities/employee.entity';
dotenv.config();

const repository = AppDataSource.getRepository(Employee);


const login = async (payload: { email: string, password: string }) => {
  let user = await repository.findOne({where: { email: payload.email }});
  let userType = 'Employee';


  if (!user) {
    throw createError(404, 'User not found');
  }

  if (user.password !== payload.password) {
    throw createError(400, 'Email or password is invalid');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, userType },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '15d',
    }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, userType },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '30d',
    }
  );

  return {
    token,
    refreshToken
  };
}

const refreshToken = async (user: { id: string, email: string, userType: string }) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, userType: user.userType },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '15d',
    }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, userType: user.userType },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '30d',
    }
  );

  return {
    token,
    refreshToken
  };
}
  
  const getProfile = async (id: number) => {
    console.log('getprofile', id)

    const user = await repository
    .createQueryBuilder('employee')
    .select(["employee.id", "employee.email", /* other fields except password */])
    .where("employee.id = :id", { id })
    .getOne();

    return user;
  };
  
  export default {
    login,
    refreshToken,
    getProfile
  }
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

  if (!user) {
    throw createError(404, 'User not found');
  }

  if (user.password !== payload.password) {
    throw createError(400, 'Email or password is invalid');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '15d',
    }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email},
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

const refreshToken = async (user: { id: string, email: string }) => {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '15d',
    }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email},
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
  // SELECT * FROM employees WHERE id = id
  console.log(id);

  const user = await repository
    .createQueryBuilder("e")
    .where("e.id = :id", { id })
    .select(["e.id",
     "e.email",
      "e.name",
      "e.phonenumber",
      "e.position",
      "e.address",
      "e.gender"])
    .getOne();
  
  return user;
};

  
  export default {
    login,
    refreshToken,
    getProfile
  }
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppDataSource } from '../data-source';
import { Member } from '../entities/member.entity';
dotenv.config();

const repository = AppDataSource.getRepository(Member);

const login = async (payload: { email: string; password: string }) => {
  let member = await repository.findOne({ where: { email: payload.email } });
  let userType = 'Member';

  if (!member) {
    throw createError(404, 'User not found');
  }

  if (member.password !== payload.password) {
    throw createError(400, 'Email or password is invalid');
  }

  const token = jwt.sign({ id: member.id, email: member.email, userType }, process.env.JWT_SECRET as string, {
    expiresIn: '15d',
  });

  const refreshToken = jwt.sign({ id: member.id, email: member.email, userType }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });

  return {
    token,
    refreshToken,
  };
};

const refreshToken = async (member: { id: string; email: string; userType: string }) => {
  const token = jwt.sign({ id: member.id, email: member.email, userType: member.userType }, process.env.JWT_SECRET as string, {
    expiresIn: '15d',
  });

  const refreshToken = jwt.sign({ id: member.id, email: member.email, userType: member.userType }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });

  return {
    token,
    refreshToken,
  };
};

const getProfile = async (id: number) => {
  console.log('getprofile', id);

  const member = await repository
    .createQueryBuilder('member')
    .select(['member.id', 'member.email' /* other fields except password */])
    .where('member.id = :id', { id })
    .getOne();

  return member;
};

export default {
  login,
  refreshToken,
  getProfile,
};

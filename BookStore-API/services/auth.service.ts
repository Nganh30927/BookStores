import {Request, Response, NextFunction} from 'express';
import createError from 'http-errors'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppDataSource } from '../data-source';
import { Employee } from '../entities/employee.entity';
import { Member } from '../entities/member.entity';

const employeerepository = AppDataSource.getRepository(Employee);
const membererepository = AppDataSource.getRepository(Member);
dotenv.config();

const login = async(payload: {email: string, password: string})=>{
    //Tìm xem trong collection Employee 
    //có tồn tại employee có email này không
    let user = await employeerepository.findOne({ where: { email: payload.email}});
    let userType = 'Employee';

    if (!user) {
      let user: Employee | Member | null = await employeerepository.findOne({ where: { email: payload.email}});
      userType = 'Member';
    }

    //Nếu không tồn tại
    if(!user){
      throw createError(404, 'User not found');
    }
    //Nếu tồn tại ==> So sánh mật khẩu trong DB
    //với mật khẩu người dùng gửi lên
    if(user.password !== payload.password){
      throw createError(400, 'Email or password is invalid');
    }
    //Nếu khớp tất cả ==> trả về token
    //Tồn tại thì trả lại thông tin user kèm token
    const token = jwt.sign(
      { id: user.id, email: user.email},
      process.env.JWT_SECRET as string,
      {
        expiresIn: '15d', // expires in 15 days
      }
    );
  
    const refreshToken  = jwt.sign(
      { id: user.id, email: user.email},
      process.env.JWT_SECRET as string,
      {
        expiresIn: '30d', // expires in 30 days
      }
    );
    return {
      token,
      refreshToken
    };
  }
  
  const refreshToken = async (user: {id: number, email: string, userType: string})=>{
  
    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType},
      process.env.JWT_SECRET as string,
      {
        expiresIn: '15d', // expires in 15 days
      }
    );
  
    const refreshToken  = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType},
      process.env.JWT_SECRET as string,
      {
        expiresIn: '30d', // expires in 30 days
      }
    );
    return {
      token,
      refreshToken
    };
  }
  
  
  const getProfile = async (id: number, userType: string) => {
    let user;

    if (userType === 'Employee') {
      user = await employeerepository
        .createQueryBuilder('employee')
        .select(["employee.id", "employee.email", /* other fields except password */])
        .where("employee.id = :id", { id })
        .getOne();
    } else if (userType === 'Member') {
      user = await membererepository
        .createQueryBuilder('member')
        .select(["member.id", "member.email", /* other fields except password */])
        .where("member.id = :id", { id })
        .getOne();
    } else {
      throw createError(400, 'Invalid user type');
    }
    return user;
  };
  
  export default {
    login,
    refreshToken,
    getProfile
  }
import { Category } from "../entities/category.entity";

import {AppDataSource} from '../data-source';
import createError from 'http-errors';
const repository = AppDataSource.getRepository(Category);

const getItemById = async (id: number) => {
    // SELECT * FROM employees WHERE id = id
    console.log(id);
  
    const category = await repository.findOneBy({
      id: id,
  
    })
    return category
  
   
  };
  
  export default {
   
    getItemById,
    
  };
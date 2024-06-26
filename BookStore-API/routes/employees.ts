import express, { NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Employee } from '../entities/employee.entity';

const router = express.Router();
const repository = AppDataSource.getRepository(Employee);

/*G */

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employees = await repository.find();
      if (employees.length === 0) {
        res.status(204).send({
          error: 'No content',
        });
      } else {
        res.json(employees);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  router.get('/:id', async (req: Request, res: Response, next: any) => {
    try {
      const employee = await repository.findOneBy({ id: parseInt(req.params.id) });
      if (!employee) {
        return res.status(410).json({ error: 'Not found' });
      }
      res.json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  /*Create */

  router.post('/', async (req: Request, res: Response, next: any) => {
    try {
      const employee = new Employee();
      Object.assign(employee, req.body);
      await repository.save(employee);
      res.status(201).json(employee);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  });

     /*Update*/

  router.patch('/:id', async (req: Request, res: Response, next: any) => {
    try {
      const employee = await repository.findOneBy({ id: parseInt(req.params.id) });
      if (!employee) {
        return res.status(410).json({ error: 'Not found' });
      }
  
      Object.assign(employee, req.body);
      await repository.save(employee);
  
      const updatedEmployee = await repository.findOneBy({ id: parseInt(req.params.id) });
      res.json(updatedEmployee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/:id', async (req: Request, res: Response, next: any) => {
    try {
      const employee = await repository.findOneBy({ id: parseInt(req.params.id) });
      if (!employee) {
        return res.status(410).json({ error: 'Not found' });
      }
      await repository.delete({ id: parseInt(req.params.id) });
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  export default router;
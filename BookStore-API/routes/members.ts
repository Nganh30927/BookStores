import express, { NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Member } from '../entities/member.entity';

const repository = AppDataSource.getRepository(Member);

const router = express.Router();

/*G */

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const members = await repository.find();
      if (members.length === 0) {
        res.status(204).send({
          error: 'No content',
        });
      } else {
        res.json(members);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  router.get('/:id', async (req: Request, res: Response, next: any) => {
    try {
      const member = await repository.findOneBy({ id: parseInt(req.params.id) });
      if (!member) {
        return res.status(410).json({ error: 'Not found' });
      }
      res.json(member);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  /*Create */

  router.post('/', async (req: Request, res: Response, next: any) => {
    try {
      const member = new Member();
      Object.assign(member, req.body);
  
      // Kiểm tra tồn tại của email
      const existingMember = await repository.findOneBy({ email: member.email });
      if (existingMember) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      await repository.save(member);
      res.status(201).json(member);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
     /*Update*/

  router.patch('/:id', async (req: Request, res: Response, next: any) => {
    try {
      const member = await repository.findOneBy({ id: parseInt(req.params.id) });
      if (!member) {
        return res.status(410).json({ error: 'Not found' });
      }
  
      Object.assign(member, req.body);
      await repository.save(member);
  
      const updatedEmployee = await repository.findOneBy({ id: parseInt(req.params.id) });
      res.json(updatedEmployee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/:id', async (req: Request, res: Response, next: any) => {
    try {
      const member = await repository.findOneBy({ id: parseInt(req.params.id) });
      if (!member) {
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
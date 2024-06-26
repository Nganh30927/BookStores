import express, { NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Publisher } from '../entities/publisher.entity';

const repository = AppDataSource.getRepository(Publisher);

const router = express.Router();

/* GET categories */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const publishers = await repository.find();
    if (publishers.length === 0) {
      res.status(204).send({
        error: 'No content',
      });
    } else {
      res.json(publishers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* GET publisher by id */
router.get('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const publisher = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!publisher) {
      return res.status(410).json({ error: 'Not found' });
    }
    res.json(publisher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* POST publisher */
router.post('/', async (req: Request, res: Response, next: any) => {
  try {
    const publisher = new Publisher();
    Object.assign(publisher, req.body);

    await repository.save(publisher);
    res.status(201).json(publisher);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
});

/* PATCH publisher */
router.patch('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const publisher = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!publisher) {
      return res.status(410).json({ error: 'Not found' });
    }

    Object.assign(publisher, req.body);
    await repository.save(publisher);

    const updatedCategory = await repository.findOneBy({ id: parseInt(req.params.id) });
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* DELETE publisher */
router.delete('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const publisher = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!publisher) {
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
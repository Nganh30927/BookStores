import express, { Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Book } from '../entities/book.entity';

const router = express.Router();

const repository = AppDataSource.getRepository(Book);

/* GET Books */
router.get('/', async (req: Request, res: Response, next: any) => {
  try {
    // SELECT * FROM [Books] AS 'book'
    const books = await repository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .getMany();

    if (books.length === 0) {
      res.status(204).send();
    } else {
      res.json(books);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* GET book by id */
router.get('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const book = await repository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .where('book.id = :id', { id: parseInt(req.params.id) })
      .getOne();
    if (!book) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* POST book */
router.post('/', async (req: Request, res: Response, next: any) => {
  try {
    const book = new Book();
    Object.assign(book, req.body);
    await repository.save(book);
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* PATCH book */
router.patch('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const book = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!book) {
      return res.status(404).json({ error: 'Not found' });
    }

    Object.assign(book, req.body);

    await repository.save(book);

    const updatedBook = await repository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.category', 'c')
      .where('b.id = :id', { id: parseInt(req.params.id) })
      .getOne();
    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* DELETE book */
router.delete('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const book = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!book) {
      return res.status(404).json({ error: 'Not found' });
    }
    await repository.delete({
      id: book.id,
    });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
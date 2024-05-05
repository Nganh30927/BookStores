import express, { Request, Response, NextFunction } from 'express';
import { Book } from '../entities/book.entity';
import fs from 'fs';
import path from 'path';
import multer, { diskStorage } from 'multer';

import { AppDataSource } from '../data-source';
const repository = AppDataSource.getRepository(Book);

const router = express.Router();

const UPLOAD_DIRECTORY = './public/uploads';

const storage = diskStorage({
  destination: function (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {
    const PATH = `${UPLOAD_DIRECTORY}/books/${req.params.id}`;
    if (!fs.existsSync(PATH)) {
      fs.mkdirSync(PATH, { recursive: true });
    }
    callback(null, PATH);
  },
  filename: function (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
    const safeFileName = toSafeFileName(file.originalname);
    callback(null, safeFileName);
  },
});

const upload = multer({ storage }).single('file');

function toSafeFileName(fileName: string): string {
  const fileInfo = path.parse(fileName);
  const safeFileName = fileInfo.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() + fileInfo.ext;
  return safeFileName;
}

router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.json({
    message: 'Welcome to the UPLOAD API',
  });
});

router.post('/books/:id', async (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, async (err: any) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const id = req.params.id;
    const patchData = {
      imageUrl: `/uploads/books/${req.params.id}/${req.file.filename}`,
    };

    // Find the book
    const book = await repository
      .createQueryBuilder('book')
      .where('book.id = :id', { id: parseInt(req.params.id) })
      .getOne();

    if (book) {
      // Update the book data
      book.imageURL = patchData.imageUrl;

      // Save the updated book data
      const updatedBook = await repository.save(book);

      const publicUrl = `${req.protocol}://${req.get('host')}/uploads/books/${req.params.id}/${req.file.filename}`;

      res.status(200).json({ message: 'File uploaded successfully', publicUrl });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });
});


export default router;
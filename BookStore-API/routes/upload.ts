import express, { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
// import multerS3 from 'multer-s3';
const { S3Client } = require('@aws-sdk/client-s3');

import { AppDataSource } from '../data-source';
import { Book } from '../entities/book.entity';

const repository = AppDataSource.getRepository(Book);

const UPLOAD_DIRECTORY = path.join(__dirname, '..', 'public', 'uploads');
const router: Router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {
      const { id, collectionName } = req.params;

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
  }),
}).single('file');

function toSafeFileName(fileName: string): string {
  const fileInfo = path.parse(fileName);
  const safeFileName = fileInfo.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() + fileInfo.ext;
  return safeFileName;
}

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: 'Welcome to the file upload API',
  });
});

router.post('/books/:id', async (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, async (err: any) => {
    if (err) {
      // An error occurred when uploading
      return res.status(500).json({ message: err.message });
    }
    // Everything went fine
    // console.log('host', req.get('host'));

    const id = req.params.id;
    const filename = req.file ? req.file.filename : '';
    const patchData = {
      imageURL: `/uploads/books/${req.params.id}/${filename}`,
    };

    let found = await repository.findOneBy({ id: parseInt(id) });

    if (found) {
      found.imageURL = patchData.imageURL;
      await repository.save(found);

      // found = await repository.save({ ...found, ...patchData });
      const publicUrl: string = `${req.protocol}://${req.get('host')}/uploads/books/${req.params.id}/${filename}`;

      res.status(200).json({ message: 'File uploaded successfully', publicUrl });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });
});

//Patch Book Image Url
router.patch('/books/:id', async (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, async (err: any) => {
    if (err) {
      // An error occurred when uploading
      return res.status(500).json({ message: err.message });
    }
    // Everything went fine
    const id = parseInt(req.params.id);
    const filename = req.file ? req.file.filename : '';
    const patchData = {
      imageURL: `/uploads/books/${req.params.id}/${filename}`,
    };

    let found = await repository.findOneBy({ id: id });

    if (found) {
      found.imageURL = patchData.imageURL;
      await repository.save(found);

      // found = await repository.save({ ...found, ...patchData });
      const publicUrl: string = `${req.protocol}://${req.get('host')}/uploads/books/${req.params.id}/${filename}`;

      res.status(200).json({ message: 'File uploaded successfully', publicUrl });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });
});

// Delete Book Image folder
router.delete('/books/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const PATH = `${UPLOAD_DIRECTORY}/books/${id}`;

  if (fs.existsSync(PATH)) {
    fs.rmdirSync(PATH, { recursive: true });
    res.status(200).json({ message: 'Image deleted successfully' });
  }
  fs.rmdirSync(UPLOAD_DIRECTORY + '/books', { recursive: true });
});

export default router;

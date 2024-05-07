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

const UPLOAD_DIRECTORY = './public/uploads';
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

// const s3 = new S3Client();

// const upload2 = multer({
//   storage: multerS3({
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     s3: s3,
//     bucket: 'some-bucket',
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString());
//     },
//   }),
// });

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

router.post('/books/:id', function (req: Request, res: Response, next: NextFunction) {
  upload(req, res, async (err: any) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
      });
    }
    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/books/${req.params.id}/${req.file?.filename}`;

    res.status(200).json({
      message: 'File uploaded successfully',
      publicUrl,
    });
    // Find the book
    const book = await repository
      .createQueryBuilder('book')
      .where('book.id = :id', { id: parseInt(req.params.id) })
      .getOne();

    const patchData = {
      imageUrl: `/uploads/books/${req.params.id}/${req.file?.filename}`,
    };

    if (book) {
      // Update the book data
      book.imageURL = patchData.imageUrl;

      // Save the updated book data
      const updatedBook = await repository.save(book);

      res.status(200).json({ message: 'File uploaded successfully', publicUrl });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });
});

export default router;
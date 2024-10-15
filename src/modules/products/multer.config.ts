// multer.config.ts
import { diskStorage } from 'multer';
import * as path from 'path';

// Define storage configuration for multer
export const multerConfig = {
  storage: diskStorage({
    // Define the destination directory
    destination: './uploads',

    // Define the naming convention for uploaded files
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, fileName);
    },
  }),

  // You can add more multer options here (e.g., file size limits)
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
};

import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

// Ensure the 'uploads' folder exists or create it
const uploadsDir = path.join(__dirname, '..', '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);  // Save files to the uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // Save the file with a timestamp and original name
  }
});

export const upload = multer({ storage });

import multer from 'multer';

// Use memory-based storage buffering instead of writing physical files to the server disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Enforce rigid document safety constraints. Only accept clean PDF streams.
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type format! Only PDF document formats are permitted.'), false);
  }
};

export const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 Megabyte limit envelope 
  },
  fileFilter: fileFilter
}).single('file'); // 'file' represents the exact field key inside incoming request packets

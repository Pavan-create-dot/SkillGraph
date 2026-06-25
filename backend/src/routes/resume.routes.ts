import { Router } from 'express';
import multer from 'multer';
import { getResume, analyzeResume } from '../controllers/resume.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB cap
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain'];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are supported'));
    }
  },
});

router.get('/', authenticate, getResume);
router.post('/analyze', authenticate, upload.single('file'), analyzeResume);

export default router;

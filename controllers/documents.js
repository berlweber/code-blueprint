import express from 'express';
const router = express.Router();
import Document from '../models/document.js';

router.get('/', (req, res) => {
    res.send('works!!!!!!!!!!!!!!!!!');
});

export default router;
import express from 'express';
const router = express.Router();

import Project from '../models/project.js';

// GET index projects
router.get('/', async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error.message);
    }
})

export default router;
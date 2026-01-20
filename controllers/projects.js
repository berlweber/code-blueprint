import express from 'express';
const router = express.Router();

import Project from '../models/project.js';

// GET index projects
router.get('/', async (req, res) => {
    try {
        const allProjects = await Project.find({});
        res.render('projects/index.ejs', {
            projects: allProjects,
        });
    } catch (error) {
        console.log(error.message);
        res.redirect('/');
    }
});

// GET form for new project
router.get('/new', (req, res) => {
    res.render('porjects/new.ejs');
});

export default router;
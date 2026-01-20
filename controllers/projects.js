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
    res.render('projects/new.ejs');
});

router.post('/', async (req, res) => {
    try {
        req.body.owner = req.session.user._id;
        await Project.create(req.body);
        res.redirect('/projects');
    } catch (error) {
        console.log(error.message);
        res.redirect('/projects');
    }
});

export default router;
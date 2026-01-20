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

// GET form for new project route
router.get('/new', async (req, res) => {
    const allProjects = await Project.find({});
    res.render('projects/new.ejs', {
        projects: allProjects,
    });
});

// POST route for new project
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

// show GET route
router.get('/:projectId', async (req, res) => {
    try {
        const allProjects = await Project.find({});
        const project = await Project.findById(req.params.projectId);
        res.render('projects/show.ejs', {
            project: project,
            projects: allProjects,
        });
    } catch (error) {
        console.log(error.message);
        res.redirect('/projects');
    }
});

// delete project route
router.delete('/:projectId', async (req, res) => {
    res.send('hi!')
});

export default router;
import express from 'express';
const router = express.Router();
import Project from '../models/project.js';
import Document from '../models/document.js';

// GET index projects
router.get('/', async (req, res) => {
    try {
        const allProjects = await Project.find({ owner: req.session.user._id });
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
    const allProjects = await Project.find({ owner: req.session.user._id });
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
        const allProjects = await Project.find({ owner: req.session.user._id });
        const alldocs = await Document.find({ project: req.params.projectId });
        const project = await Project.findById(req.params.projectId);
        if (project.owner.equals(req.session.user._id)) {
            res.render('projects/show.ejs', {
            project: project,
            projects: allProjects,
            docs: alldocs,
            });
        } else {
        res.send('You do not have the permission to view this project');
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/projects');
    }
});

// delete project route
router.delete('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (project.owner.equals(req.session.user._id)) {
            console.log('permission granted')
            await project.deleteOne();
            res.redirect('/projects');
        } else {
        res.send('You do not have the permission to delete this project');
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/projects');
    }
});

// edit GET form route
router.get('/:projectId/edit', async (req, res) => {
    try {
        const allProjects = await Project.find({ owner: req.session.user._id });
        const project = await Project.findById(req.params.projectId);
        res.render('projects/edit.ejs', {
            project: project,
            projects: allProjects,
        });
    } catch (error) {
        console.log(error.message);
        res.redirect('/projects');
    }
});

// update PUT route
router.put('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        await project.updateOne(req.body);
        res.redirect(`/projects/${req.params.projectId}`);
    } catch (error) {
        console.log(error.message);
        res.redirect('/projects');
    }
});

export default router;
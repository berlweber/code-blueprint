import express from 'express';
const router = express.Router();
import Document from '../models/document.js';
import Project from '../models/project.js';

// router.get('/', (req, res) => {
//     res.send('works!!!!!!!!!!!!!!!!!');
// });

// create GET route
router.get('/:projectId/new', async (req, res) => {
    const allProjects = await Project.find({ owner: req.session.user._id });
    res.render('documents/new.ejs', {
        projects: allProjects,
        thisProject: req.params.projectId,
    });
});

// POST new doc route
router.post('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('owner');
        if (project.owner.equals(req.session.user._id) ) {
            req.body.owner = req.session.user._id;
            req.body.project = project._id;
            // if (req.body.parentDoc) >>> asign parentDoc id
            if (req.body.done) req.body.done = true;
            console.log(req.body);
            await Document.create(req.body);
            res.redirect('/projects');//change this one with the following after availibe
            // res.redirect(`projects/:${project._id}`);
        } else {
        res.send('You do not have the permission to add documents to this project');
        }
    } catch (error) {
        console.log(error.message);
        res.redirect(`projects/:${req.params.projectId}`);
    }
});

export default router;
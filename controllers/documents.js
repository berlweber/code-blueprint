import express from 'express';
const router = express.Router();
import Document from '../models/document.js';
import Project from '../models/project.js';

// router.get('/', (req, res) => {
//     res.send('works!!!!!!!!!!!!!!!!!');
// });

// create route
router.get('/new', async (req, res) => {
    const allProjects = await Project.find({ owner: req.session.user._id });
    res.render('documents/new.ejs', {
        projects: allProjects,
    });
});

export default router;
import express from 'express';
const router = express.Router();
import Document from '../models/document.js';
import Project from '../models/project.js';

// router.get('/', (req, res) => {
//     res.send('works!!!!!!!!!!!!!!!!!');
// });

// create GET route
router.get('/new', async (req, res) => {
    const allProjects = await Project.find({ owner: req.session.user._id });
    res.render('documents/new.ejs', {
        projects: allProjects,
    });
});

// POST new doc route
router.post('/', async (req, res) => {
    try {
        req.body.owner = req.session.user._id;
        
        await Document.create(req.body);
        res.redirect('/documents');
    } catch (error) {
        console.log(error.message);
        res.redirect('/documents');
    }
});

export default router;
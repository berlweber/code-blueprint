import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path'
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();;


// middleware
import isSignedIn from './middleware/is-signed-in.js';
import passUserToView from './middleware/pass-user-to-view.js';
import Project from './models/project.js';

// controllers
import authController from './controllers/users.js';
import projectsController from './controllers/projects.js';
import documentsController from './controllers/documents.js';

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
    })
);
// middleware for stylesheets
app.use(express.static(path.join(__dirname, "public")));

app.use(passUserToView);

// routes
app.get('/', async (req, res) => {
    try {
        const allProjects = await Project.find({ owner: req.session.user._id });
        res.render('index.ejs', {
            projects: allProjects,
        });
    } catch (error) {
        console.log(error.message);
        res.render('index.ejs');
    }
});

app.use('/auth', authController);
app.use('/projects', isSignedIn, projectsController);
app.use('/documents', isSignedIn, documentsController);

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
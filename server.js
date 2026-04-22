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

app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'");
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
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
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        },
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
        const allProjects = req.session.user
            ? await Project.find({ owner: req.session.user._id })
            : [];
        res.render('index.ejs', {
            projects: allProjects,
        });
    } catch (error) {
        console.log(error.message);
        res.render('index.ejs');
    }
});

app.get('/privacy', (req, res) => {
    res.render('privacy.ejs');
});

app.use('/auth', authController);
app.use('/projects', isSignedIn, projectsController);
app.use('/documents', isSignedIn, documentsController);

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});

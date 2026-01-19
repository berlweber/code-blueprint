import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import User from '../models/user.js';

// sign-up GET route
router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

// sign-up POST route
router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username });
        console.log('this is the database user', userInDatabase);
        if (userInDatabase) {
            return res.send('Username already taken. try a different username.')
        }

        if (req.body.password !== req.body.confirmPassword){
            return res.send('Password and Confirm Password must match.')
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;
        await User.create(req.body);
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// sign-in GET route
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

// sign-in POST route
router.post('/sign-in', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (!userInDatabase) {
            return res.send('Login failed. Please try again.');
        }
        const validPassword = bcrypt.compareSync(
            req.body.password,
            userInDatabase.password
        );

        if (!validPassword) {
            return res.send('Login failed. Please try again.');
        }

        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id
        };

        req.session.save(() => {
            res.redirect('/');
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// sign-out GET route
router.get('/sign-out', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

export default router;
const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user'); // Make sure this model exists

// Set view engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Show all users
app.get('/read', async (req, res) => {
    let allUsers = await userModel.find();
    res.render('read.ejs', { user: allUsers });
});

// Create a user
app.post('/create', async (req, res) => {
    let { name, email, image } = req.body;
    await userModel.create({ name, email, image });
    res.redirect('/read');
});

// Delete a user
app.get('/delete/:id', async (req, res) => {
    await userModel.findOneAndDelete({ _id: req.params.id });
    res.redirect('/read');
});

// Render edit page
app.get('/edit/:id', async (req, res) => {
    let user = await userModel.findOne({ _id: req.params.id });
    res.render('edit.ejs', { user });
});

// Update user details
app.post('/update/:id', async (req, res) => {
    let { name, email, image } = req.body;
    await userModel.findOneAndUpdate(
        { _id: req.params.id },
        { name, email, image },
        { new: true }
    );
    res.redirect('/read');
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

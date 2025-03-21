// Amit Chahal - 0003832


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const connectString = 'mongodb+srv://amitchahal24:amit2402@cluster0.tmulg.mongodb.net/webUsers';

app.use(bodyParser.json());
app.use(cors()); // Enable CORS

mongoose
    .connect(connectString, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error Connecting to MongoDB:', err));

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

//Routes

//Create a new user
app.post('/users', async(req, res) => {
    try {
        console.log(req.body);
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Read all users
app.get('/users', async(req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Read a single user by id
app.get('/users/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Update a user by id
app.put('/users/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User Updated Successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete a user by id
app.delete('/users/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User deleted successfuly');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://samyukthak24mca:sammca@cluster0.wiusbiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String
});

const Student = mongoose.model('Student', studentSchema);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

// Home - List all students
app.get('/', async (req, res) => {
    const students = await Student.find();
    res.render('index', { students });
});

// Show form to add new student
app.get('/students/new', (req, res) => {
    res.render('new');
});

// Create new student
app.post('/students', async (req, res) => {
    const { name, age, email } = req.body;
    await Student.create({ name, age, email });
    res.redirect('/');
});

// Show form to edit student
app.get('/students/:id/edit', async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('edit', { student });
});

// Update student
app.post('/students/:id', async (req, res) => {
    const { name, age, email } = req.body;
    await Student.findByIdAndUpdate(req.params.id, { name, age, email });
    res.redirect('/');
});

// Delete student
app.post('/students/:id/delete', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 
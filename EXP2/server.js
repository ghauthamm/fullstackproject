const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Handlebars setup
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/submit', (req, res) => {
  const formData = req.body;
  fs.writeFileSync('data.json', JSON.stringify(formData, null, 2));
  res.redirect('/display');
});

app.get('/display', (req, res) => {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync('data.json'));
  } catch (e) {}
  res.render('display', { data });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 
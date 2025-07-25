require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET = process.env.SECRET || 'secret';

// Update connection string to use the new format with password placeholder
mongoose.connect('mongodb+srv://ghauthamms:ghautham27@exp6.jisizne.mongodb.net/?retryWrites=true&w=majority&appName=exp6', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', userSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(SECRET));
app.use(express.static(path.join(__dirname, 'public')));

function authMiddleware(req, res, next) {
  if (req.signedCookies && req.signedCookies.user) {
    return next();
  }
  res.redirect('/index.html');
}

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  res.cookie('user', username, { signed: true, httpOnly: true });
  res.json({ success: true });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  res.clearCookie('user');
  res.json({ success: true });
});

// Protected dashboard
app.get('/dashboard.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 
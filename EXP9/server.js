const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load questions from JSON file
function getQuestions(topic) {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json')));
  return data[topic] || [];
}

// Endpoint to get questions by topic
app.get('/api/questions', (req, res) => {
  const { topic } = req.query;
  if (!topic) return res.status(400).json({ error: 'Topic required' });
  const questions = getQuestions(topic);
  res.json({ questions });
});

// Endpoint to submit answers and get score
app.post('/api/submit', (req, res) => {
  const { topic, answers } = req.body;
  if (!topic || !answers) return res.status(400).json({ error: 'Topic and answers required' });
  const questions = getQuestions(topic);
  let score = 0;
  questions.forEach((q, idx) => {
    if (answers[idx] === q.answer) score++;
  });
  res.json({ score, total: questions.length });
});

app.listen(PORT, () => {
  console.log(`Quiz server running on http://localhost:${PORT}`);
}); 
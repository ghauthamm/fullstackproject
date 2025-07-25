const topicSelect = document.getElementById('topic');
const startBtn = document.getElementById('start-btn');
const quizForm = document.getElementById('quiz-form');
const resultDiv = document.getElementById('result');
const topicDiv = document.getElementById('topic-select');

let currentQuestions = [];

startBtn.onclick = async () => {
  const topic = topicSelect.value;
  const res = await fetch(`/api/questions?topic=${topic}`);
  const data = await res.json();
  currentQuestions = data.questions;
  renderQuiz(currentQuestions);
  topicDiv.style.display = 'none';
  quizForm.style.display = '';
  resultDiv.style.display = 'none';
};

function renderQuiz(questions) {
  quizForm.innerHTML = '';
  questions.forEach((q, idx) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'question-block';
    qDiv.innerHTML = `
      <div class="question">${idx + 1}. ${q.question}</div>
      <div class="options">
        ${q.options.map((opt, i) => `
          <label><input type="radio" name="q${idx}" value="${i}" required> ${opt}</label>
        `).join('')}
      </div>
    `;
    quizForm.appendChild(qDiv);
  });
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Submit Answers';
  quizForm.appendChild(submitBtn);
}

quizForm.onsubmit = async (e) => {
  e.preventDefault();
  const answers = [];
  currentQuestions.forEach((q, idx) => {
    const selected = quizForm.querySelector(`input[name="q${idx}"]:checked`);
    answers.push(selected ? parseInt(selected.value) : null);
  });
  const topic = topicSelect.value;
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, answers })
  });
  const data = await res.json();
  quizForm.style.display = 'none';
  resultDiv.style.display = '';
  resultDiv.textContent = `Your Score: ${data.score} / ${data.total}`;
  topicDiv.style.display = '';
}; 
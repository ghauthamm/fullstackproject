const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'todos.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read todos
function readTodos() {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Helper to write todos
function writeTodos(todos) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// Get all todos
app.get('/api/todos', (req, res) => {
    res.json(readTodos());
});

// Add a new todo
app.post('/api/todos', (req, res) => {
    const todos = readTodos();
    const newTodo = {
        id: Date.now(),
        text: req.body.text
    };
    todos.push(newTodo);
    writeTodos(todos);
    res.json(todos);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
    let todos = readTodos();
    todos = todos.filter(todo => todo.id != req.params.id);
    writeTodos(todos);
    res.json(todos);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 
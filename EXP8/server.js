const express = require('express');
const app = express();
const PORT = 3000;

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Ping server running on port ${PORT}`);
}); 
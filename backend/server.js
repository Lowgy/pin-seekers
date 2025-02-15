const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/courses', (req, res) => {});

app.post('/register', (req, res) => {});

app.post('/login', (req, res) => {});

app.delete('/review/:id', (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

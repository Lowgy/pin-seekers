const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/courses', (req, res) => {});

app.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      res.status(409).send({ message: 'This user may exist already.' });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });

    const token = jwt.sign(newUser, process.env.JWT_SECRET);

    res
      .status(200)
      .send({ message: 'User registered successfully!', token: token });
  } catch (err) {
    next();
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      const passwordCheck = bcrypt.compareSync(password, user.password);
      if (passwordCheck) {
        const token = jwt.sign(user, process.env.JWT_SECRET);
        res
          .status(200)
          .send({ message: 'User Logged in successfully', token: token });
      } else {
        res.status(400).send({ message: 'Incorrect password or email' });
      }
    }

    res
      .status(400)
      .send({ message: 'Something went wrong, please try again.' });
  } catch (err) {
    next();
  }
});

app.delete('/review/:id', (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

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

const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization;
  const user = jwt.verify(token, process.env.JWT_SECRET);

  if (!user) {
    return res
      .status(401)
      .send({ message: 'You must be logged in to perform this action' });
  }

  req.user = user;
  next();
};

app.get('/courses', isLoggedIn, async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany();
    if (courses) {
      res.status(200).send({ message: 'Retrieved Courses', courses: courses });
    }
  } catch (err) {
    next();
  }
});

app.get('/course/:name', async (req, res, next) => {
  try {
    const course = await prisma.course.findFirst({
      where: {
        id: req.params.id,
      },
    });

    if (!course) {
      res.status(400).send({ message: 'This course does not exist.' });
    }

    res
      .status(200)
      .send({ message: 'Course found successfully.', course: course });
  } catch (err) {
    next();
  }
});

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

app.get('/account', isLoggedIn, (req, res, next) => {
  const { id, name, email } = req.user;
  res.status(200).send({
    id: id,
    name: name,
    email: email,
  });
});

app.delete('/review/:id', (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
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

app.get('/course/:id', async (req, res, next) => {
  try {
    const course = await prisma.course.findFirst({
      where: {
        id: req.params.id,
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(400).send({ message: 'This course does not exist.' });
    }

    const formattedReviews = course.reviews.map((review) => ({
      title: review.title,
      body: review.body,
      rating: review.rating,
      user: review.user.name,
      createdAt: review.createdAt,
    }));

    const formattedCourse = {
      ...course,
      reviews: formattedReviews,
    };

    res.status(200).send({
      message: 'Course found successfully.',
      course: formattedCourse,
    });
  } catch (err) {
    next(err);
  }
});

app.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await prisma.user.findUnique({
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

app.get('/account', isLoggedIn, async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
      include: {
        reviews: true,
      },
    });
    res.status(200).send({
      message: 'User successfully retrieved',
      user: user,
    });
  } catch (err) {
    next();
  }
});

app.put('/account', isLoggedIn, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      res.status(400).send({ message: 'Error updating user.' });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: req.body.name,
        email: req.body.email,
      },
      include: {
        reviews: true,
      },
    });

    res
      .status(200)
      .send({ message: 'Updated user successfully', user: updatedUser });
  } catch (err) {
    next();
  }
});

app.post('/review', isLoggedIn, async (req, res, next) => {
  const token = req.headers.authorization;
  const user = jwt.decode(token, process.env.JWT_SECRET);
  try {
    const { title, body, rating, course } = req.body;

    const [review, updatedCourse] = await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          title: title,
          body: body,
          rating: rating,
          userId: user.id,
          courseId: course,
        },
      });

      const reviews = await tx.review.findMany({
        where: {
          courseId: course,
        },
      });

      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        reviews.length > 0 ? totalRating / reviews.length : 0;

      const updatedCourse = await tx.course.update({
        where: {
          id: course,
        },
        data: {
          averageRating: averageRating,
        },
      });

      return [review, updatedCourse];
    });

    const reviews = await prisma.review.findMany({
      where: {
        courseId: course,
      },
      include: {
        user: true,
      },
    });

    const formattedReviews = [];
    for (var i = 0; i < reviews.length; i++) {
      if (course === reviews[i].courseId) {
        let review = {
          title: reviews[i].title,
          body: reviews[i].body,
          rating: reviews[i].rating,
          user: reviews[i].user.name,
          createdAt: reviews[i].createdAt,
        };
        formattedReviews.push(review);
      }
    }

    res.status(200).send({
      message: 'Review successfully created and course rating updated',
      review: formattedReviews,
    });
  } catch (err) {
    next(err);
  }
});

app.delete('/review/:id', isLoggedIn, async (req, res, next) => {
  try {
    const review = await prisma.review.findFirst({
      where: {
        id: req.params.id,
      },
    });

    if (!review) {
      res.status(400).send({ message: 'Error deleting review' });
    }

    await prisma.review.delete({
      where: {
        id: req.params.id,
      },
    });

    res
      .status(200)
      .send({ message: 'Review deleted successfully', review: review });
  } catch (err) {
    next();
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

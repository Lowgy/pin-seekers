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

app.get('/featured-courses', async (req, res, next) => {
  try {
    let courses;
    const featuredCourses = await prisma.course.findMany({
      where: {
        featured: true,
      },
      orderBy: {
        averageRating: 'desc',
      },
      take: 3,
    });

    if (featuredCourses.length >= 3) {
      courses = featuredCourses;
    } else {
      const highlyRatedCourses = await prisma.course.findMany({
        where: {
          averageRating: {
            in: [4, 5],
          },
        },
        orderBy: {
          averageRating: 'desc',
        },
        take: 3,
      });
      courses = highlyRatedCourses;
    }

    res.status(200).send({ message: 'Courses Retrieved', courses: courses });
  } catch (err) {
    next();
  }
});

app.get('/courses', async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany();
    if (courses) {
      res.status(200).send({ message: 'Retrieved Courses', courses: courses });
    }
  } catch (err) {
    next();
  }
});

app.get('/course/:id', isLoggedIn, async (req, res, next) => {
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

    if (!name || !email || !password) {
      res.status(400).send({ message: 'All fields are required.' });
    }

    if (!email.includes('@') || !email.includes('.')) {
      res.status(400).send({ message: 'Please enter a valid email address.' });
    }

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

    if (!email || !password) {
      res.status(400).send({ message: 'All fields are required.' });
    }

    if (!email.includes('@') || !email.includes('.')) {
      res.status(400).send({ message: 'Please enter a valid email address.' });
    }

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

app.get('/reviews', async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
      include: {
        user: true,
        course: true,
      },
    });

    if (!reviews) {
      res.status(400).send({ message: 'No recent reviews found' });
    }

    res
      .status(200)
      .send({ message: 'Recent reviews retrieved.', reviews: reviews });
  } catch (err) {
    next();
  }
});

app.post('/review', isLoggedIn, async (req, res, next) => {
  try {
    const { title, body, rating, course } = req.body;

    const [review, updatedCourse] = await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          title: title,
          body: body,
          rating: rating,
          userId: req.user.id,
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
    const reviewToDelete = await prisma.review.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!reviewToDelete) {
      return res.status(404).send({ message: 'Review not found' });
    }

    const courseId = reviewToDelete.courseId;

    // Perform the deletion and average rating update in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete the review
      await tx.review.delete({
        where: {
          id: req.params.id,
        },
      });

      // Recalculate the average rating for the course
      const reviews = await tx.review.findMany({
        where: {
          courseId: courseId,
        },
      });

      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        reviews.length > 0 ? totalRating / reviews.length : 0;

      // Update the course with the new average rating
      await tx.course.update({
        where: {
          id: courseId,
        },
        data: {
          averageRating: averageRating,
        },
      });
    });

    res.status(200).send({ message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

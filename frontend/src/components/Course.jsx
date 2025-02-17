import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
  ClockIcon,
  ChevronLeft,
} from 'lucide-react';
import NavBar from '@/components/NavBar';

const Course = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const getCourseInfo = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/course/${id}`);
        setCourse(data.course);
        setIsLoading(false);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (token) {
      getCourseInfo();
    }
  }, []);

  return isLoading ? (
    <>
      <h1>Loading...</h1>
    </>
  ) : (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            asChild
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            <Link to="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
        <Card className="mb-8">
          <CardHeader className="relative p-0">
            <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-lg font-semibold">
              <StarIcon className="inline-block w-5 h-5 mr-1" />5
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              {course.name}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="flex items-center text-green-600 mb-2">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  {course.address}
                </p>
                <p className="flex items-center text-green-600 mb-2">
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  <a href="/" className="hover:underline">
                    123-123-1233
                  </a>
                </p>
                <p className="flex items-center text-green-600 mb-2">
                  <GlobeIcon className="w-5 h-5 mr-2" />
                  <a
                    href="/backend"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Visit Website
                  </a>
                </p>
                <p className="flex items-center text-green-600">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  {course.hours}
                </p>
              </div>
              {/* <div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                About the Course
              </h2>
              <p className="text-gray-600">{course.description}</p>
            </div> */}
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold text-green-800 mb-4">Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* {course.reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-green-800">
                  {review.author}
                </h3>
                <div className="flex items-center">
                  <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
                  <span>{review.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{review.content}</p>
              <p className="text-sm text-gray-500">{review.date}</p>
            </CardContent>
          </Card>
        ))} */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-800">
              Add Your Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Name
                </label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rating
                </label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rate from 1 to 5"
                />
              </div>
              <div>
                <label
                  htmlFor="review"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Review
                </label>
                <Textarea
                  id="review"
                  placeholder="Write your review here"
                  rows={4}
                />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Course;

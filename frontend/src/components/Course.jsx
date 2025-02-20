import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
  ChevronLeft,
  FlagIcon,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import Spinner from '@/components/Spinner';

const Course = () => {
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const numberOfButtons = 5;
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [courseReviews, setCourseReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  useEffect(() => {
    const getCourseInfo = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/course/${id}`
        );
        setCourse(data.course);
        setCourseReviews(data.course.reviews);
        setIsLoading(false);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (token) {
      getCourseInfo();
    }
  }, []);

  const handleRatingClick = (e, rating) => {
    e.preventDefault();
    setRating(rating);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/review`,
        {
          title: title,
          body: review,
          rating: rating,
          course: id,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      setCourseReviews(data.review);
    } catch (err) {
      console.log(err.message);
    }
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = courseReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(courseReviews.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return isLoading ? (
    <div className="container mx-auto px-4 py-8">
      <Spinner size="lg" />
    </div>
  ) : (
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
            <FlagIcon className="inline-block w-5 h-5 mr-1" />
            {course.averageRating === 0
              ? 'N/A'
              : course.averageRating.toFixed(2)}
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
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold text-green-800 mb-4">Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div>
                      <CardTitle className="text-sm font-semibold text-green-800">
                        {review.user}
                      </CardTitle>
                      <p className="text-xs text-gray-500">
                        {format(new Date(review.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-green-100 rounded-full px-2 py-1">
                    <FlagIcon className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm font-semibold text-green-700">
                      {review.rating}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <h3 className="font-semibold text-green-800 mb-2">
                  {review.title}
                </h3>
                <p className="text-gray-600 mb-2">{review.body}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <>No Reviews</>
        )}
      </div>

      {/* Pagination */}
      {currentReviews.length > 0 && (
        <div className="flex justify-center space-x-2 mb-8">
          <Button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => paginate(i + 1)}
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              className={`${
                currentPage === i + 1
                  ? 'bg-green-600 text-white'
                  : 'text-green-600 border-green-600 hover:bg-green-50'
              }`}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-800">
            Add Your Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleReviewSubmit}>
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-green-700"
              >
                Title
              </Label>
              <Input
                id="title"
                placeholder="Title for your Review"
                onChange={(e) => setTitle(e.target.value)}
                className="border-green-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-green-700 mb-1"
              >
                Rating
              </label>
              <div className="flex space-x-2">
                {Array.from({ length: numberOfButtons }, (_, index) => (
                  <Button
                    key={index}
                    onClick={(e) => handleRatingClick(e, index + 1)}
                    variant={rating === index + 1 ? 'default' : 'outline'}
                    className={`
              h-10 px-3 flex items-center justify-center
              ${
                rating === index + 1
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'border-green-600 text-green-600 hover:bg-green-50'
              }
              transition-colors duration-200
            `}
                  >
                    <FlagIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm font-semibold">{index + 1}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="review"
                className="text-sm font-medium text-green-700"
              >
                Your Review
              </Label>
              <Textarea
                id="review"
                placeholder="Write your review here"
                rows={4}
                onChange={(e) => setReview(e.target.value)}
                className="border-green-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Course;

'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { FlagIcon, MapPinIcon, UserIcon, ArrowRightIcon } from 'lucide-react';
import axios from 'axios';

const UnAuthHome = () => {
  const [recentReviews, setRecentReviews] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    const fetchRecentReviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/reviews`
        );
        console.log(response.data.reviews);
        setRecentReviews(response.data.reviews);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchFeaturedCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/featured-courses`
        );
        console.log(response.data.courses);
        setFeaturedCourses(response.data.courses);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecentReviews();
    fetchFeaturedCourses();
  }, []);

  return (
    <div className="min-h-screen bg-green-50">
      {/* Hero Section */}
      <div className="relative bg-green-800 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <FlagIcon className="h-12 w-12 text-green-400" />
              <h1 className="text-4xl md:text-5xl font-bold ml-4">
                Pin Seekers
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Discover and review the best golf courses. Join our community of
              golf enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Link to="/login">Sign Up Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Link to="/login">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-green-800">
            Featured Courses
          </h2>
          <Button
            asChild
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            <Link to="/login">
              View All <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={
                    'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",'
                  }
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <Link to={`/course/${course.id}`}>
                    <h3 className="text-xl font-semibold text-green-800">
                      {course.name}
                    </h3>
                  </Link>
                  <div className="flex items-center bg-green-600 text-white rounded-full px-2 py-1">
                    <FlagIcon className="inline-block w-5 h-5 mr-1" />
                    <span className="text-sm font-semibold">
                      {course.averageRating}
                    </span>
                  </div>
                </div>
                <p className="text-green-600 flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {course.address}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Reviews Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-green-800">Recent Reviews</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-green-800">
                    {review.course.name}
                  </span>
                  <div className="flex items-center bg-green-600 text-white rounded-full px-2 py-1">
                    <FlagIcon className="inline-block w-5 h-5 mr-1" />
                    <span className="text-sm font-semibold">
                      {review.rating}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{review.body}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {review.user.name}
                  </div>
                  <span>
                    {format(new Date(review.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-green-600 text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join Pin Seekers?
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Sign up now to rate courses, write reviews, and connect with other
            golf enthusiasts.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-green-700 text-green-400 hover:text-white"
          >
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnAuthHome;

import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { CalendarIcon, FlagIcon, XIcon, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Spinner from '@/components/Spinner';
import { format } from 'date-fns';
import { AuthContext } from '@/lib/AuthContext';

const Profile = () => {
  const token = window.localStorage.getItem('token');
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const tryToLogin = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/account`,
            {
              headers: {
                authorization: token,
              },
            }
          );
          setUser(response.data.user);
          setIsLoading(false);
        } catch (err) {
          console.error(err.message);
        }
      };

      tryToLogin();
    }
  }, []);

  const handleEditProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/account`,
        {
          name: name || user.name,
          email: email || user.email,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      setUser(response.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleReviewDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/review/${id}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      setUser((prevUser) => ({
        ...prevUser,
        reviews: prevUser.reviews.filter((review) => review.id !== id),
      }));
    } catch (err) {
      console.error(err.message);
    }
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews =
    user?.reviews?.slice(indexOfFirstReview, indexOfLastReview) || [];
  const totalPages = Math.ceil((user?.reviews?.length || 0) / reviewsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push('...');
      }
    }
    return pages;
  };

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
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div>
              {isEditing ? (
                <form>
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-green-700"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder={user.name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2 mb-4">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-green-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder={user.email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleEditProfile}
                  >
                    Update Profile
                  </Button>
                </form>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-green-800 mb-2">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 mb-2">{user.email}</p>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </p>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold text-green-800 mb-4">Your Reviews</h2>
      <div className="space-y-6">
        {user.reviews.length > 0 ? (
          <>
            {currentReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-green-700">
                      {review.title}
                    </h1>
                    <div className="flex items-center bg-green-600 text-white rounded-full px-2 py-1">
                      <FlagIcon className="w-5 h-5 mr-1" />
                      <span className="font-semibold">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{review.body}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {format(new Date(review.createdAt), 'MMM d, yyyy')}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleReviewDelete(review.id)}
                      className="text-white hover:bg-red-400 bg-red-500"
                    >
                      <XIcon className="w-4 h-4 mr-2" />
                      Delete Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 mb-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) paginate(currentPage - 1);
                        }}
                      />
                    </PaginationItem>
                    {getPageNumbers().map((pageNum, index) => (
                      <PaginationItem key={index}>
                        {pageNum === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              paginate(pageNum);
                            }}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            paginate(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No reviews yet
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;

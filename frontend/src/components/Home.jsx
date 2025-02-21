import { useContext, useCallback, useState, useEffect } from 'react';
import { AuthContext } from '@/lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapIcon,
  ListIcon,
  SearchIcon,
  ChevronRight,
  FlagIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Map } from '@vis.gl/react-google-maps';
import GolfMarker from '@/components/GolfMarker';
import axios from 'axios';
import { debounce } from 'lodash';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const DEFAULT_ZOOM = 5.5;
  const DEFAULT_CENTER = { lat: 52.73395510255055, lng: -98.25222953460538 };
  const [viewMode, setViewMode] = useState('map');
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [golfCourses, setGolfCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const token = window.localStorage.getItem('token');

      const getCourses = async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/courses`,
            {
              headers: {
                authorization: token,
              },
            }
          );
          setGolfCourses(data.courses);
        } catch (err) {
          console.log(err.message);
        }
      };

      getCourses();
    }
  }, []);

  const handleMarkerOpen = (course) => {
    setZoom(15);
    setCenter({ lat: course.lat, lng: course.lng });
  };

  const handleMarkerClose = () => {
    setZoom(DEFAULT_ZOOM);
    setCenter(DEFAULT_CENTER);
  };

  const handleZoomChange = useCallback((ev) => {
    setZoom(ev.detail.zoom);
  });

  const handleCenterChange = useCallback((ev) => {
    setCenter(ev.detail.center);
  });

  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 200),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const filteredCourses = golfCourses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(startIndex, endIndex);

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

  return (
    <div className="flex flex-col bg-green-50 min-h-screen">
      <main className="flex-grow flex flex-col">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-green-800">
              Golf Courses
            </h2>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <MapIcon className="mr-2 h-4 w-4" /> Map View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <ListIcon className="mr-2 h-4 w-4" /> List View
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search golf courses..."
                className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        {viewMode === 'map' ? (
          <div className="h-[calc(100vh-180px)]">
            <Map
              onCenterChanged={handleCenterChange}
              onZoomChanged={handleZoomChange}
              style={{ width: '100%', height: '100%' }}
              center={center}
              mapId="golf-map"
              zoom={zoom}
            >
              {filteredCourses.map((course) => (
                <GolfMarker
                  key={course.id}
                  course={course}
                  position={{ lat: course.lat, lng: course.lng }}
                  onMarkerOpen={handleMarkerOpen}
                  onMarkerClose={handleMarkerClose}
                />
              ))}
            </Map>
          </div>
        ) : (
          <div className="container mx-auto px-4 overflow-auto">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y divide-green-100">
                  {currentCourses.map((course) => (
                    <Link to={`/course/${course.id}`} key={course.id}>
                      <li className="p-4 hover:bg-green-50 transition-colors duration-150 flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-green-800">
                            {course.name}
                          </h3>
                          <p className="text-green-600">{course.address}</p>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center bg-green-600 text-white rounded-full px-2 py-1 mr-2">
                            <FlagIcon className="w-4 h-4 mr-1" />
                            <span className="text-sm font-semibold">
                              {course.averageRating.toFixed(1)}
                            </span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-green-600" />
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center mb-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
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
                              setCurrentPage(pageNum);
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
                            setCurrentPage(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

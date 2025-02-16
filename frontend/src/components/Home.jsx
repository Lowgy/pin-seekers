import { useContext, useCallback, useState, useEffect } from 'react';
import { AuthContext } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Map } from '@vis.gl/react-google-maps';
import GolfMarker from '@/components/GolfMarker';
import { FlagIcon, MapIcon, ListIcon, SearchIcon } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const DEFAULT_ZOOM = 7;
  const DEFAULT_CENTER = {
    lat: 51.004483442123444,
    lng: -98.28399184175208,
  };
  const [viewMode, setViewMode] = useState('map');
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [golfCourses, setGolfCourses] = useState([]);

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const token = window.localStorage.getItem('token');

    const tryToLogin = async () => {
      try {
        const response = await axios.get('http://localhost:3000/account', {
          headers: {
            authorization: token,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    tryToLogin();

    const getCourses = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/courses', {
          headers: {
            authorization: token,
          },
        });
        console.log(data.courses);
        setGolfCourses(data.courses);
      } catch (err) {
        console.log(err.message);
      }
    };

    getCourses();
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

  return (
    <div className="flex flex-col h-screen bg-green-50">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FlagIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Pin Seekers</h1>
          </div>
          <nav>
            <Button variant="ghost" className="text-white hover:text-green-200">
              Profile
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:text-green-200"
              onClick={logout}
            >
              Logout
            </Button>
          </nav>
        </div>
      </header>

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
              />
            </div>
          </div>
        </div>

        {viewMode === 'map' ? (
          <div className="flex-grow">
            <Map
              onCenterChanged={handleCenterChange}
              onZoomChanged={handleZoomChange}
              style={{ width: '100%', height: '100%' }}
              center={center}
              mapId="golf-map"
              zoom={zoom}
            >
              {golfCourses.map((course) => (
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
                  {golfCourses.map((course) => (
                    <li
                      key={course.id}
                      className="p-4 hover:bg-green-50 transition-colors duration-150"
                    >
                      <h3 className="text-lg font-semibold text-green-800">
                        {course.name}
                      </h3>
                      <p className="text-green-600">{course.address}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

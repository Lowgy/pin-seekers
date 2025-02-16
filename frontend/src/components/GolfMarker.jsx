import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { useState, useCallback } from 'react';
import { StarIcon, MapPinIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const GolfMarker = ({ position, course, onMarkerOpen, onMarkerClose }) => {
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const handleMarkerClick = useCallback(() => {
    if (onMarkerOpen) {
      onMarkerOpen(course);
      setInfoWindowShown(true);
    }
  });

  const handleMarkerClose = useCallback(() => {
    if (onMarkerClose) {
      onMarkerClose();
      setInfoWindowShown(false);
    }
  });
  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      >
        <div className="relative w-8 h-10 cursor-pointer">
          <div className="absolute bottom-0 left-0 w-1 h-8 bg-gray-700 transform -rotate-15"></div>
          <div className="absolute top-0 left-0 w-6 h-6 bg-red-500 rounded-tr-full"></div>
          <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
        </div>
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleMarkerClose}>
          <Card className="w-72 overflow-hidden">
            {/* <CardHeader className="p-0">
          <img src={course.image || "/placeholder.svg"} alt={course.name} className="w-full h-32 object-cover" />
          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            <StarIcon className="inline-block w-4 h-4 mr-1" />
            {course.rating.toFixed(1)}
          </div>
        </CardHeader> */}
            <CardContent className="p-4">
              <CardTitle className="text-lg font-bold text-green-800 mb-2">
                {course.name}
              </CardTitle>
              <CardDescription className="text-sm text-green-600 mb-4">
                <MapPinIcon className="inline-block w-4 h-4 mr-1" />
                {course.address}
              </CardDescription>
              <div className="space-y-2 mb-4"></div>
              <Link to={`/course/${course.id}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  View Course Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        </InfoWindow>
      )}
    </>
  );
};

export default GolfMarker;

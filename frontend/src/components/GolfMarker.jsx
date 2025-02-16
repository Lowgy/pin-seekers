import { AdvancedMarker } from '@vis.gl/react-google-maps';

const GolfMarker = ({ position, course, onMarkerClick }) => {
  const handleClick = () => {
    if (onMarkerClick) {
      onMarkerClick(course); // Pass the course data if needed
    }
  };
  return (
    <AdvancedMarker position={position} onClick={handleClick}>
      <div className="relative w-8 h-10 cursor-pointer">
        <div className="absolute bottom-0 left-0 w-1 h-8 bg-gray-700 transform -rotate-15"></div>
        <div className="absolute top-0 left-0 w-6 h-6 bg-red-500 rounded-tr-full"></div>
        <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
      </div>
    </AdvancedMarker>
  );
};

export default GolfMarker;

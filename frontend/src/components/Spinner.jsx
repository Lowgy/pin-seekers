import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[100px]">
      <Loader2 className={`animate-spin text-green-600 ${sizeClasses[size]}`} />
    </div>
  );
};

export default Spinner;

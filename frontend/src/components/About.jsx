import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FlagIcon, MapIcon, StarIcon, UsersIcon } from 'lucide-react';

const features = [
  {
    icon: <MapIcon className="h-8 w-8 text-green-600" />,
    title: 'Find Courses',
    description:
      'Discover golf courses near you with our interactive map and comprehensive search features.',
  },
  {
    icon: <StarIcon className="h-8 w-8 text-green-600" />,
    title: 'Read & Write Reviews',
    description:
      'Share your experiences and learn from other golfers with detailed course reviews and ratings.',
  },
  {
    icon: <UsersIcon className="h-8 w-8 text-green-600" />,
    title: 'Join the Community',
    description:
      'Connect with fellow golf enthusiasts and build your golfing network.',
  },
  {
    icon: <FlagIcon className="h-8 w-8 text-green-600" />,
    title: 'Track Your Journey',
    description:
      "Keep track of the courses you've played and maintain your personal review history.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-green-50">
      <div className="bg-green-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <FlagIcon className="h-12 w-12 text-green-400" />
              <h1 className="text-4xl md:text-5xl font-bold ml-4">
                About Pin Seekers
              </h1>
            </div>
            <p className="text-xl text-green-100">
              Your trusted companion for discovering and reviewing golf courses.
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600">
            Pin Seekers was created with a simple goal: to help golfers find
            their perfect course and share their experiences with the community.
            We believe that every round of golf tells a story, and we're here to
            help you tell yours.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-green-100">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="shrink-0">{feature.icon}</div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of golfers who are already part of our community.
            Sign up today and start exploring courses near you.
          </p>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link to="/login">Sign Up Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;

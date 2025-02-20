import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlagIcon } from 'lucide-react';
import { AuthContext } from '@/lib/AuthContext';

const LoginRegister = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          email: email,
          password: password,
        }
      );
      window.localStorage.setItem('token', data.token);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/account`,
        {
          headers: {
            authorization: data.token,
          },
        }
      );
      setUser(response.data);
      navigate('/');
    } catch (err) {
      console.err(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          email: email,
          name: name,
          password: password,
        }
      );
      window.localStorage.setItem('token', data.token);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/account`,
        {
          headers: {
            authorization: data.token,
          },
        }
      );

      setUser(response.data);
      navigate('/');
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const token = window.localStorage.getItem('token');

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
        setUser(response.data);
        navigate('/');
      } catch (err) {
        console.error(err.message);
      }
    };

    tryToLogin();
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-800 to-green-600 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <Card className="w-[400px] bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <FlagIcon className="h-12 w-12 text-green-600" />
            <h1 className="text-3xl font-bold text-green-800 ml-2">
              Pin Seekers
            </h1>
          </div>
          <p className="text-green-700">
            Find your perfect course, share your golfing journey
          </p>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="login"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-green-800">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-green-800">
                    Password
                  </Label>
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-green-800">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-green-800">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-green-800">
                    Password
                  </Label>
                  <Input
                    id="password"
                    placeholder="Choose a password"
                    type="password"
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
            onClick={activeTab === 'login' ? handleLogin : handleRegister}
          >
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginRegister;

import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { FlagIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    user && (
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/">
            <div className="flex items-center space-x-2">
              <FlagIcon className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Pin Seekers</h1>
            </div>
          </Link>
          <nav>
            <Button
              variant="ghost"
              className="text-white hover:text-green-200"
              asChild
            >
              <Link to="/profile">Profile</Link>
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
    )
  );
};

export default NavBar;

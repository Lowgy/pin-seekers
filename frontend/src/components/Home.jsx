import { useContext } from 'react';
import { AuthContext } from '@/lib/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <h1>User: {user.name}</h1>
    </>
  );
};

export default Home;

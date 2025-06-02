import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { token, name, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Portfolio</Link>
        <nav className="space-x-4">
          <Link to="/projects">Projects</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/hobbies">Hobbies</Link>
          <Link to="/studies">Studies</Link>
          {token ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {name}</span>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
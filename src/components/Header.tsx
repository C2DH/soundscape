import LogoSow from './svg/LogoSow';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import './Header.css';

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <header
      className={`Header ${isHome ? 'isHome' : ''} w-full absolute top-0 left-0 right-0 z-10`}
    >
      <nav className="flex items-center justify-center px-6 py-4">
        <ul className="flex items-center space-x-5 sm:space-x-8 text-gray-700 font-medium">
          {/* Left side */}
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/overview">Overview</Link>
          </li>

          {/* Center logo */}
          <li className="logo-sow items-center justify-center">
            <LogoSow width={100} />
          </li>

          {/* Right side */}
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

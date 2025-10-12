import LogoSow from './svg/LogoSow';
import { NavLink, useLocation } from 'react-router';
import './Header.css';

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <header
      className={`Header ${isHome ? 'isHome' : ''} w-full absolute top-0 left-0 right-0 z-20`}
    >
      <nav className="flex items-center justify-center px-6 py-4">
        <ul className="flex items-center space-x-3 sm:space-x-8 text-gray-700 font-medium">
          {/* Left side */}
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/overview">Overview</NavLink>
          </li>

          {/* Center logo */}
          <li className="logo-sow items-center justify-center">
            <LogoSow width={100} />
          </li>

          {/* Right side */}
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
        </ul>
      </nav>
      <div className="Header-background" />
    </header>
  );
};

export default Header;

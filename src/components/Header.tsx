import LogoSow from './svg/LogoSow';

const Header: React.FC = () => {
  return (
    <header className="w-full absolute top-0 left-0 right-0 z-10">
      <nav className="flex items-center justify-center px-6 py-4">
        <ul className="flex items-center space-x-3 sm:space-x-8 text-gray-700 font-medium">
          {/* Left side */}
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#overview">Overview</a>
          </li>

          {/* Center logo */}
          <li className="items-center justify-center">
            <LogoSow width={100} />
          </li>

          {/* Right side */}
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

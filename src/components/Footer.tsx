import LogoUniLux from './svg/LogoUniLux';
import LogoUniLinkoping from './svg/LogoUniLinkoping';
import { useLocation } from 'react-router';
import './Footer.css';
import ThreeDsLogo from './svg/ThreeDsLogo';
import { isMobile } from 'react-device-detect';

const Footer: React.FC = () => {
  const { pathname } = useLocation();
  const footerIsVisible = pathname === '/' || pathname === '/about';

  return (
    <footer
      className={`${footerIsVisible ? 'footerIsVisible' : ''} absolute bottom-2 left-0 w-full bg-transparent gap-2 z-2`}
    >
      <div className="max-w-10xl mx-auto flex flex-col items-left px-2 md:px-8 py-1 md:py-3">
        {/* Left side: Logos */}
        <div className="flex flex-wrap items-center gap-4 my-2">
          <LogoUniLux width={isMobile ? 90 : 120} />
          <LogoUniLinkoping width={isMobile ? 80 : 110} />
          <ThreeDsLogo width={isMobile ? 80 : 110} />
        </div>

        <span className="text-[0.7rem] font-medium text-[rgba(var(--light),1)]">
          © {new Date().getFullYear()} University of Luxembourg and Linköping University. All
          rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

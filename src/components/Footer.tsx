import LogoUniLux from './svg/LogoUniLux';
import LogoUniLinkoping from './svg/LogoUniLinkoping';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-2 left-0 w-full bg-transparent gap-2">
      <div className="max-w-10xl mx-auto flex items-center justify-between px-2 md:px-8 py-3">
        {/* Left side: Logos */}
        <div className="flex items-center gap-4 m-2">
          <LogoUniLux width={120} />
          <LogoUniLinkoping width={110} />
        </div>

        <span className="text-[0.8rem] text-[rgba(var(--light),1)] my-2">
          © {new Date().getFullYear()} University of Luxembourg and Linköping University. All
          rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

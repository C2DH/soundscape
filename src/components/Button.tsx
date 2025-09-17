import { Link } from 'react-router';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string; // Accessible text (screen readers)
  icon?: React.ReactNode; // Optional icon
  href?: string; // Optional link
  link?: string; // Optional link
};

const Button: React.FC<ButtonProps> = ({ label, icon, className, href, link, ...props }) => {
  const content = (
    <>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={className + ' link-button'}
        aria-label={label}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  if (link) {
    return (
      <Link
        to={link}
        className={className + ' link-button'}
        aria-label={label}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button {...props} className={className} aria-label={label}>
      {content}
    </button>
  );
};

export default Button;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string; // Accessible text (screen readers)
  icon?: React.ReactNode; // Optional icon
  link?: string; // Optional link
};

const Button: React.FC<ButtonProps> = ({ label, icon, className, link, ...props }) => {
  const content = (
    <>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </>
  );

  if (link) {
    return (
      <a
        href={link}
        className={className + ' link-button'}
        aria-label={label}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button {...props} className={className} aria-label={label}>
      {content}
    </button>
  );
};

export default Button;

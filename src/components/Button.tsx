type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string; // Accessible text (screen readers)
  icon?: React.ReactNode; // Optional icon
};

const Button: React.FC<ButtonProps> = ({ label, icon, className, ...props }) => {
  return (
    <button
      {...props}
      className={`${className}
      `}
      aria-label={label}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default Button;

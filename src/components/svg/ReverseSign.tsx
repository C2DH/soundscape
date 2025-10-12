import './ReverseSign.css';

interface LogoProps {
  color?: string;
  width?: number;
  className?: string;
  onClick?: () => void;
}

const ReverseSign: React.FC<LogoProps> = ({
  color = 'rgba(var(--accent),1)',
  width = 24,
  className,
  onClick,
}) => {
  const ratio = 32 / 26.36;
  const height = width / ratio;

  return (
    <div
      className={`ReverseSign icon SVG ${className} flex cursor-pointer`}
      style={{ height: height + 'px', width: width + 'px' }}
      onClick={onClick}
    >
      <svg
        id="reverse"
        data-name="Reverse-Sign"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 26.36"
      >
        <path
          fill={color}
          d="M29.18 20.72H7.32v-2.81L0 22.13l7.32 4.23v-2.81H32V8.79l-2.82 1.63zM2.82 5.64h21.86v2.81L32 4.22 24.68 0v2.81H0v14.76l2.82-1.63z"
        />
      </svg>
    </div>
  );
};

export default ReverseSign;

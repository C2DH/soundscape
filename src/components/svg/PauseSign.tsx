interface LogoProps {
  color?: string;
  width?: number;
  className?: string;
}

const PauseSign: React.FC<LogoProps> = ({
  color = 'rgba(var(--accent),1)',
  width = 24,
  className,
}) => {
  const ratio = 24 / 27;
  const height = width / ratio;

  return (
    <div
      className={`icon SVG ${className} flex cursor-pointer`}
      style={{ height: height + 'px', width: width + 'px' }}
    >
      <svg id="pause" data-name="Pause-Sign" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 27">
        <path fill={color} d="M0 0h5v27H0V0ZM12 0h5v27h-5V0Z" />
      </svg>
    </div>
  );
};

export default PauseSign;

interface LogoProps {
  color?: string;
  width?: number;
  className?: string;
}

const PlaySign: React.FC<LogoProps> = ({
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
      <svg id="play" data-name="Play-Sign" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 27">
        <path fill={color} d="M23.25 13.423 0 26.847V0l23.25 13.423Z" />
      </svg>
    </div>
  );
};

export default PlaySign;

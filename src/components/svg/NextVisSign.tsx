interface LogoProps {
  color?: string;
  width?: number;
  className?: string;
}

const NextVisSign: React.FC<LogoProps> = ({
  color = 'rgba(var(--accent),1)',
  width = 16,
  className,
}) => {
  const ratio = 13 / 15;
  const height = width / ratio;

  return (
    <div
      className={`icon SVG ${className} flex cursor-pointer`}
      style={{ height: height + 'px', width: width + 'px' }}
    >
      <svg
        id="next-visual"
        data-name="Next-Visual-Sign"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 13 15"
      >
        <path fill={color} d="M13 7.5.25 14.86V.14L13 7.499Z" />
        <path fill={color} d="M11 .139h2v14.86h-2V.14Z" />
      </svg>
    </div>
  );
};

export default NextVisSign;

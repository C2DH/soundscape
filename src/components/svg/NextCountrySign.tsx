interface LogoProps {
  color?: string;
  width?: number;
  className?: string;
}

const NextCountrySign: React.FC<LogoProps> = ({
  color = 'rgba(var(--accent),1)',
  width = 20,
  className,
}) => {
  const ratio = 24 / 15;
  const height = width / ratio;

  return (
    <div
      className={`icon SVG ${className} flex cursor-pointer`}
      style={{ height: height + 'px', width: width + 'px' }}
    >
      <svg
        id="next-country"
        data-name="Next-Country-Sign"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 15"
      >
        <path fill={color} d="M23.75 7.5 11 14.861V.14L23.75 7.5Z" />
        <path fill={color} d="M21.75.139h2v14.86h-2V.14ZM13.25 7.5.5 14.861V.14L13.25 7.5Z" />
      </svg>
    </div>
  );
};

export default NextCountrySign;

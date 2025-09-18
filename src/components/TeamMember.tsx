import React from 'react';
import './TeamMember.css';

type TeamMemberProps = {
  className?: string;
  image: string;
  title: string;
  subtitle?: string;
  href?: string;
  size?: number; // optional diameter in px, default 96
};

const TeamMember: React.FC<TeamMemberProps> = ({
  image,
  title,
  subtitle,
  href,
  className,
  size = 200,
}) => {
  const content = (
    <>
      <img style={{ width: size + 'px', height: size + 'px' }} src={image} alt={title} />
      <div>
        <h2>{title}</h2>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>
    </>
  );

  return (
    <div
      className={`TeamMember ${className} relative`}
      role="group"
      aria-label={`Team member ${title}`}
    >
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};

export default TeamMember;

import React, { useRef, useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { AvailableAudioItems } from '../constants';
import './ListNavigation.css';

type ListNavigationProps = {
  className?: string;
};

const REPEAT_COUNT = 20;

const ListNavigation: React.FC<ListNavigationProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false); // <-- visibility state

  const loopedItems = Array.from({ length: REPEAT_COUNT }).flatMap(() => AvailableAudioItems);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const half = container.scrollHeight / 2;
    container.scrollTop = half;

    const handleScroll = () => {
      const { scrollTop, scrollHeight } = container;

      if (scrollTop < scrollHeight * 0.25) {
        container.scrollTop = scrollTop + half;
      } else if (scrollTop > scrollHeight * 0.75) {
        container.scrollTop = scrollTop - half;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        aria-label="Soundscape navigation"
        className={`ListNavigation ${className} ${isOpen ? 'visible' : 'hidden'}`}
      >
        {/* Toggle visibility via class */}
        <ul ref={containerRef} className={`nav-list infinite-scroll`}>
          {loopedItems.map((item, idx) => (
            <li key={`${item.id}-${idx}`} className="nav-item">
              <NavLink
                to={item.url}
                className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="open-country-list relative no-style z-50"
        aria-label="Toggle country list"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="bar"></span>
        country list
        <span className="bar"></span>
      </button>
    </>
  );
};

export default ListNavigation;

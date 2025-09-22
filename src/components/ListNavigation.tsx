import React, { useRef, useEffect } from 'react';
import { NavLink } from 'react-router';
import { AvailableAudioItems } from '../constants';
import './ListNavigation.css';

type ListNavigationProps = {
  className?: string;
};

const REPEAT_COUNT = 20; // repeat items to make a long loop

const ListNavigation: React.FC<ListNavigationProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLUListElement>(null);

  // build a long list of repeated items
  const loopedItems = Array.from({ length: REPEAT_COUNT }).flatMap(() => AvailableAudioItems);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const half = container.scrollHeight / 2;

    // start in the middle
    container.scrollTop = half;

    const handleScroll = () => {
      const { scrollTop, scrollHeight } = container;

      // when near the top → push back to middle
      if (scrollTop < scrollHeight * 0.25) {
        container.scrollTop = scrollTop + half;
      }
      // when near the bottom → pull back to middle
      else if (scrollTop > scrollHeight * 0.75) {
        container.scrollTop = scrollTop - half;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav aria-label="Soundscape navigation" className={`ListNavigation ${className}`}>
      <ul ref={containerRef} className="nav-list infinite-scroll">
        {loopedItems.map((item, idx) => (
          <li key={`${item.id}-${idx}`} className="nav-item">
            <NavLink
              to={item.url}
              className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ListNavigation;

import { Link } from 'react-router';
import { AvailableAudioItems } from '../constants';
import type { AudioItem } from '../types';
import { useStore } from '../store';

export type NavAudioItemsProps = {
  // Define any props needed for NavAudioItems here
  items?: AudioItem[];
};

const NavAudioItems: React.FC<NavAudioItemsProps> = ({ items = AvailableAudioItems }) => {
  const currentParamItemId = useStore((state) => state.currentParamItemId);
  return (
    <ul className="NavAudioItems">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            to={item.url}
            className={`NavAudioItem ${currentParamItemId === item.id ? 'text-bold underline' : ''}`}
          >
            {item.name} id:{item.id}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavAudioItems;

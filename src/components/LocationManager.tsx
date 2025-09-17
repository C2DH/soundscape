import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useStore } from '../store.ts';
import { AvailableAudioItems } from '../constants.ts';

type LocationManagerProps = {
  debug?: boolean;
};

const LocationManager: React.FC<LocationManagerProps> = ({ debug = false }) => {
  const { pathname } = useLocation();
  const setCurrentParamItemId = useStore((state) => state.setCurrentParamItemId);
  const currentParamItemId = useStore((state) => state.currentParamItemId);
  useEffect(() => {
    console.info('[LocationManager] Location changed:', pathname);
    const matchedItem = AvailableAudioItems.find((item) => item.url === pathname);
    setCurrentParamItemId(matchedItem ? matchedItem.id : null);
  }, [pathname]);

  if (!debug) {
    return null;
  }

  return (
    <div>
      <h2>Location Manager (Debug Mode)</h2>
      <p>Current Path: {pathname}</p>
      <p>Current Item ID: {currentParamItemId}</p>
    </div>
  );
};

export default LocationManager;

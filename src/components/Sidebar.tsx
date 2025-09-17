import { useSidebarStore } from '../store';
import { AvailableAudioItems } from '../constants';
import { useStore } from '../store';

import './Sidebar.css';
import Button from './Button';

export default function Sidebar() {
  const { isOpenSidebar } = useSidebarStore();
  const currentParamItemId = useStore((s) => s.currentParamItemId);
  // const setCurrentParamItemId = useStore((s) => s.setCurrentParamItemId);
  const item = AvailableAudioItems.find((i) => i.id === currentParamItemId);

  return (
    <div className=" Sidebar h-full z-80">
      {/* Sidebar */}
      <aside
        className={`${isOpenSidebar ? 'isOpenSidebar' : ''} w-full h-full flex-shrink-0 
        `}
      >
        {isOpenSidebar && (
          <div className="flex relative flex-col h-full">
            <span className="sound-code absolute top-0 right-0">{item?.id}</span>
            {/* Header */}
            <header className="flex text-sm">
              <div className="meta-data">
                <p className="font-semibold">Meta A</p>
                <p className="text-gray-500">Detail A</p>
              </div>
              <div className="meta-data ml-4">
                <p className="font-semibold">Meta B</p>
                <p className="text-gray-500">Detail B</p>
              </div>
            </header>
            <hr></hr>

            {/* Scrollable content */}
            <div className="content flex-1 overflow-y-auto space-y-4">
              <p>{item?.desc}</p>
            </div>

            {/* Footer */}
            <footer className="p-6">
              {item?.link && (
                <Button
                  label={'Open link'}
                  href={undefined}
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  {item?.link}
                </Button>
              )}
            </footer>
          </div>
        )}
      </aside>
    </div>
  );
}

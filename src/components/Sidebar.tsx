import { useSidebarStore, useStore, useModalStore } from '../store';
import { AvailableAudioItems } from '../constants';
import './Sidebar.css';

export default function Sidebar() {
  const currentParamItemId = useStore((s) => s.currentParamItemId);
  const item = AvailableAudioItems.find((i) => i.id === currentParamItemId);

  const isOpenSidebar = useSidebarStore((s) => s.isOpenSidebar);
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar);
  const isOpenModal = useModalStore((s) => s.isOpenModal);

  console.log('Rendering Sidebar, isOpenSidebar:', isOpenSidebar, 'isOpenModal:', isOpenModal);

  return (
    <>
      <button
        onClick={toggleSidebar}
        aria-expanded={isOpenSidebar}
        className={`${isOpenModal ? '' : 'isModalClosed'} more-info p-2`}
      >
        <i className="relative">
          <span className="bar"></span>
          <span className={`bar ${isOpenSidebar ? 'open' : ''}`}></span>
        </i>
        <p>MORE INFO</p>
      </button>
      <div className={`${isOpenSidebar ? 'isOpenSidebar' : ''}  Sidebar`}>
        {/* Sidebar */}
        <aside className="w-full h-full flex-shrink-0">
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
                <a href="/" rel="noreferrer" className="link-button ">
                  {item?.link}
                </a>
              )}
            </footer>
          </div>
        </aside>
      </div>
    </>
  );
}

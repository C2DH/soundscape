import { useSidebarStore, useStore, useModalStore, useMeshStore } from '../store';
import { AvailableAudioItems } from '../constants';
import GeometryExporter from './GeometryExporter';
import './Sidebar.css';

export default function Sidebar() {
  const currentParamItemId = useStore((s) => s.currentParamItemId);
  const item = AvailableAudioItems.find((i) => i.id === currentParamItemId);

  const isOpenSidebar = useSidebarStore((s) => s.isOpenSidebar);
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar);
  const isOpenModal = useModalStore((s) => s.isOpenModal);
  const mesh = useMeshStore((s) => s.mesh);

  console.log('Rendering Sidebar, isOpenSidebar:', isOpenSidebar, 'isOpenModal:', isOpenModal);

  return (
    <>
      <div className={`${isOpenSidebar && isOpenModal ? 'isOpenSidebar' : ''}  Sidebar`}>
        <button
          onClick={toggleSidebar}
          aria-expanded={isOpenSidebar}
          className={`${isOpenModal ? '' : 'isModalClosed'} more-info p-2`}
        >
          <i className="relative">
            <span className="bar"></span>
            <span className={`bar ${isOpenSidebar ? 'open' : ''}`}></span>
          </i>
          <p>{isOpenSidebar ? 'LESS' : 'MORE'} INFO</p>
        </button>
        {/* Sidebar */}
        <aside className="w-full h-full flex-shrink-0">
          <div className="flex relative flex-col h-full">
            <span className="sound-code absolute top-0 left-0">{item?.id}</span>
            {/* Header */}
            <header className="flex text-sm">
              {/* <div className="meta-data">
                <p className="font-semibold">Meta A</p>
                <p className="text-gray-500">Detail A</p>
              </div>
              <div className="meta-data ml-4">
                <p className="font-semibold">Meta B</p>
                <p className="text-gray-500">Detail B</p>
              </div> */}
            </header>
            <hr></hr>

            {/* Scrollable content */}
            <div className="content flex-1 overflow-y-auto space-y-4">
              <p dangerouslySetInnerHTML={{ __html: item?.desc ?? '' }}></p>
              <h3 className="font-semibold">Sources</h3>
              <p dangerouslySetInnerHTML={{ __html: item?.sources ?? '' }}></p>
            </div>

            {/* Footer */}
            <footer className="flex justify-between items-center p-6 z-90">
              {item?.link && (
                <a href={item.link[0]} rel="noreferrer" className="link-button" target="_blank">
                  {item?.link[1] ? item?.link[1] : 'WIKIPEDIA'}
                </a>
              )}
              <div className="GeometryExporter opacity-60">
                {mesh && <GeometryExporter ref={{ current: mesh }} />}
              </div>
            </footer>
          </div>
        </aside>
      </div>
    </>
  );
}

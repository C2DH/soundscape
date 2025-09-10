import { Route, Routes, useLocation } from 'react-router';
import './App.css';
import LocationManager from './hooks/LocationManager';
import World from './components/World';
import { OrbitControls, Grid, OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Header from './components/Header';
import { useEffect } from 'react';
import Modal from './components/Modal';
import SoundScape from './components/SoundScape';
import frequenceListDenmark from './assets/frequencies_denmark.json';
import { amplifyLists } from './components/SoundScapePlayer';
import { useThemeStore, useSidebarStore } from './store';
import Footer from './components/Footer';
import AudioControls from './components/AudioControls';
import Sidebar from './components/Sidebar';
import SoundEqualizerButton from './components/SoundEqualizerButton';
import AboutPage from './pages/AboutPage';
import { useModalStore } from './store';

const DenmarkScene: React.FC = () => {
  // ⬇️ This is basically your Storybook args
  const args = {
    lists: amplifyLists(frequenceListDenmark, 0.6),
  };

  const color = useThemeStore((s) => s.colors['--light']);

  return (
    <Canvas shadows camera={{ position: [100, 100, 50], fov: 50 }}>
      <OrbitControls />
      <group>
        <SoundScape {...args} />
        <Grid
          args={[160, 160]}
          cellSize={5}
          cellColor={color}
          sectionSize={80}
          sectionColor={color}
          fadeDistance={200}
          fadeStrength={2}
        />
      </group>
    </Canvas>
  );
};

function App() {
  const refreshFromCSS = useThemeStore((s) => s.refreshFromCSS);
  const { isOpenSidebar } = useSidebarStore();
  const location = useLocation();
  const path = location.pathname;
  const { isOpenModal, closeModal } = useModalStore();

  useEffect(() => {
    refreshFromCSS();
  }, [refreshFromCSS]);

  const geoPoints = [
    { id: 'denmark', name: 'Denmark', lat: 56.2639, lon: 9.5018 },
    { id: 'sweden', name: 'Sweden', lat: 60.1282, lon: 18.6435 },
    { id: 'norway', name: 'Norway', lat: 60.472, lon: 8.4689 },
    { id: 'luxembourg', name: 'Luxembourg', lat: 49.6118, lon: 6.1319 },
    { id: 'finland', name: 'Finland', lat: 61.9241, lon: 25.7482 },
    { id: 'iceland', name: 'Iceland', lat: 64.9631, lon: -19.0208 },
    { id: 'italy', name: 'Italy', lat: 41.8719, lon: 12.5674 },
    { id: 'spain', name: 'Spain', lat: 40.4637, lon: -3.7492 },
    { id: 'portugal', name: 'Portugal', lat: 39.3999, lon: -8.2245 },
    { id: 'belgium', name: 'Belgium', lat: 50.5039, lon: 4.4699 },
    { id: 'netherlands', name: 'Netherlands', lat: 52.3676, lon: 4.9041 },
  ];
  return (
    <>
      <LocationManager />
      <Routes>
        <Route index element={null} />
        <Route path="/item/:itemId" element={null} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <div className="main-wrapper flex-1 relative flex flex-row-reverse h-full 'w-full'">
        <main
          className={` ${isOpenSidebar ? 'isOpenSidebar' : ''} main-section w-full relative h-full`}
        >
          <Header />
          <Canvas shadows>
            <OrthographicCamera
              makeDefault
              zoom={35} // zoom level (higher = closer)
              position={[5, 5, 5]} // position like perspective
              near={-1000}
              far={1000}
            />
            <ambientLight intensity={0.4} />
            <directionalLight
              castShadow
              position={[5, 10, 5]}
              intensity={1}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />

            <World
              geoPoints={geoPoints}
              radius={5.3}
              position={path === '/about' ? [-10, -10, 10] : [0, 0, 0]}
              scale={path === '/about' ? [1.6, 1.6, 1.6] : [1, 1, 1]}
            />

            <OrbitControls
              enablePan={false}
              enableRotate={true}
              minZoom={35} // smallest zoom (farthest away)
              maxZoom={200} // largest zoom (closest in)
              zoomSpeed={1}
            />
          </Canvas>
          <Footer />

          <Modal isOpen={isOpenModal} onClose={closeModal}>
            <p className="big-text font-medium tracking-[-0.06em] uppercase absolute top-[10%] left-0 w-full flex flex-col items-center text-[12vw] opacity-20">
              Denmark
            </p>
            <DenmarkScene />
          </Modal>
          {isOpenModal ? (
            <AudioControls
              onNextVis={() => {}}
              onPrevVis={() => {}}
              onNextCountry={() => {}}
              onPrevCountry={() => {}}
            />
          ) : null}
        </main>
        <Sidebar />
        <SoundEqualizerButton />
      </div>
    </>
  );
}

export default App;

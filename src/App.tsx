import { Route, Routes } from 'react-router';
import './App.css';
import LocationManager from './components/LocationManager';
import World from './components/World';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Header from './components/Header';
import { useSidebarStore, useThemeStore } from './store';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import SoundEqualizerButton from './components/SoundEqualizerButton';
import AboutPage from './pages/AboutPage';
import SceneManager from './components/SceneManager';
import { AvailableAudioItems } from './constants';
import { useEffect } from 'react';
import type { GeoPoint } from './types';
function App() {
  const { isOpenSidebar } = useSidebarStore();

  const geoPoints: GeoPoint[] = AvailableAudioItems.map((item) => ({
    id: item.id,
    url: item.url,
    name: item.name,
    lat: item.lat,
    lon: item.lon,
  }));
  const refreshFromCSS = useThemeStore((s) => s.refreshFromCSS);

  useEffect(() => {
    refreshFromCSS();
  }, []);

  return (
    <>
      <LocationManager />
      <Routes>
        <Route index element={null} />
        {AvailableAudioItems.map((item) => (
          <Route key={item.name} path={item.url} element={null} />
        ))}
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <div className="main-wrapper flex-1 relative flex flex-row-reverse h-full 'w-full'">
        <main
          className={` ${isOpenSidebar ? 'isOpenSidebar' : ''} main-section w-full relative h-full`}
        >
          <SceneManager />
          <Header />
          <Canvas shadows>
            <OrthographicCamera
              makeDefault
              zoom={35} // zoom level (higher = closer)
              position={[5, 5, 5]} // position like perspective
              near={-1000}
              far={1000}
            />
            z
            <ambientLight intensity={0.4} />
            <directionalLight
              castShadow
              position={[5, 10, 5]}
              intensity={1}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <World geoPoints={geoPoints} radius={5.3} />
            <OrbitControls
              enablePan={false}
              enableRotate={true}
              minZoom={35} // smallest zoom (farthest away)
              maxZoom={200} // largest zoom (closest in)
              zoomSpeed={1}
            />
          </Canvas>
          <Footer />
        </main>
        <Sidebar />
        <SoundEqualizerButton />
      </div>
    </>
  );
}

export default App;

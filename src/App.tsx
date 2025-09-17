import { Route, Routes, useLocation } from 'react-router';
import './App.css';
import LocationManager from './components/LocationManager';
import World from './components/World';
import { OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Header from './components/Header';
import { useSidebarStore, useThemeStore } from './store';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import SoundEqualizerButton from './components/SoundEqualizerButton';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SceneManager from './components/SceneManager';
import { AvailableAudioItems } from './constants';
import { useEffect } from 'react';
import type { GeoPoint } from './types';
import AnimatedOrbitControls from './components/AnimatedOrbitControls';
import Button from './components/Button';

function App() {
  const { isOpenSidebar } = useSidebarStore();
  const location = useLocation();
  const path = location.pathname;

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
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      <div className="main-wrapper flex-1 relative flex flex-row-reverse h-full 'w-full'">
        <main
          className={` ${isOpenSidebar ? 'isOpenSidebar' : ''} main-section w-full relative h-full justify-center items-center`}
        >
          {path === '/' ? (
            <div className="absolute w-screen h-screen  text-center flex flex-col justify-center items-center z-30">
              <h1 className="text-4xl font-semibold max-w-[700px] mb-8 uppercase">
                The world's most complete collection of warning sounds
              </h1>
              <Button link="/overview" label="Dicover Soundscapes" className="top-4 left-4" />
            </div>
          ) : null}
          <SceneManager />
          <Header />
          <Canvas shadows>
            <OrthographicCamera
              makeDefault
              zoom={35}
              position={[5, 5, 5]}
              near={-2000}
              far={2000}
            />
            <World geoPoints={geoPoints} radius={5.3} />
            <AnimatedOrbitControls />
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

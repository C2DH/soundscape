import { Route, Routes } from 'react-router';
import './App.css';
import LocationManager from './hooks/LocationManager';
import World from './components/World';
import { OrbitControls, Grid } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Header from './components/Header';
import { useState, useEffect } from 'react';
import Modal from './components/Modal';
import SoundScape from './components/SoundScape';
import frequenceListDenmark from './assets/frequencies_denmark.json';
import { amplifyLists } from './components/SoundScapePlayer';
import { useThemeStore } from './store';
import Footer from './components/Footer';
import Button from './components/Button';
import AudioControls from './components/AudioControls';

const DenmarkScene: React.FC = () => {
  // ⬇️ This is basically your Storybook args
  const args = {
    lists: amplifyLists(frequenceListDenmark, 0.5),
  };

  const color = useThemeStore((s) => s.colors['--light']);

  return (
    <Canvas shadows camera={{ position: [100, 100, 50], fov: 50 }}>
      <ambientLight intensity={1} />
      <directionalLight castShadow intensity={1} position={[-5, 3, 0]} />
      <directionalLight intensity={3} position={[3, 3, 0]} />
      <SoundScape {...args} />
      <OrbitControls />
      <Grid
        args={[160, 160]}
        cellSize={5}
        cellColor={color}
        sectionSize={80}
        sectionColor={color}
        fadeDistance={200}
        fadeStrength={2}
      />
    </Canvas>
  );
};

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const refreshFromCSS = useThemeStore((s) => s.refreshFromCSS);

  useEffect(() => {
    // Optional: re-read periodically if you expect dynamic changes
    const interval = setInterval(refreshFromCSS, 500);
    return () => clearInterval(interval);
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
      </Routes>

      <main className="h-full w-full">
        <Header />
        <Button
          label="Open Modal"
          className="absolute bottom-[20%] left-[calc(50%-3rem)] z-10"
          onClick={() => setIsOpen(true)}
        />
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 100 }}>
          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            position={[5, 10, 5]}
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <World geoPoints={geoPoints} radius={5.3} />

          <OrbitControls enablePan={false} minDistance={6} maxDistance={10} />
        </Canvas>
        <Footer />
      </main>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="h-full w-full flex items-center justify-cente">
          <p className="big-text font-medium tracking-[-0.06em] uppercase absolute w-screen text-center top-[10%] text-[12vw] opacity-20">
            Denmark
          </p>
          <DenmarkScene />
          <AudioControls
            // isPlaying={false}
            // onPlay={() => {}}
            // onPause={() => {}}
            onNextVis={() => {}}
            onPrevVis={() => {}}
            onNextCountry={() => {}}
            onPrevCountry={() => {}}
          />
        </div>
      </Modal>
    </>
  );
}

export default App;

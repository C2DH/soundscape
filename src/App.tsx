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

const DenmarkScene: React.FC = () => {
  // ⬇️ This is basically your Storybook args
  const args = {
    lists: amplifyLists(frequenceListDenmark, 0.5),
    showWireframe: true,
  };

  const color = useThemeStore((s) => s.colors['--light']);

  return (
    <Canvas shadows camera={{ position: [50, 50, 25], fov: 50 }}>
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
    { lat: 48.8566, lon: 2.3522, color: 'red', id: 'paris' }, // Paris
    { lat: 40.7128, lon: -74.006, color: 'blue', id: 'new-york' }, // New York
    { lat: -33.8688, lon: 151.2093, color: 'green', id: 'sydney' }, // Sydney
    { lat: 51.5074, lon: -0.1278, color: 'purple', id: 'london' }, // London
    { lat: 35.6895, lon: 139.6917, color: 'orange', id: 'tokyo' }, // Tokyo
    { lat: 55.7558, lon: 37.6173, color: 'pink', id: 'moscow' }, // Moscow
    { lat: 34.0522, lon: -118.2437, color: 'yellow', id: 'los-angeles' }, // Los Angeles
    { lat: 39.9042, lon: 116.4074, color: 'cyan', id: 'beijing' }, // Beijing
    { lat: -23.5505, lon: -46.6333, color: 'brown', id: 'sao-paulo' }, // Sao Paulo
    { lat: 1.3521, lon: 103.8198, color: 'grey', id: 'singapore' }, // Singapore
    { lat: 37.7749, lon: -122.4194, color: 'teal', id: 'san-francisco' }, // San Francisco
    { lat: 55.6761, lon: 12.5683, color: 'lime', id: 'copenhagen' }, // Copenhagen
    { lat: 52.52, lon: 13.405, color: 'maroon', id: 'berlin' }, // Berlin
    { lat: 41.9028, lon: 12.4964, color: 'navy', id: 'rome' }, // Rome
    { lat: 37.9838, lon: 23.7275, color: 'olive', id: 'athens' }, // Athens
    { lat: 19.4326, lon: -99.1332, color: 'coral', id: 'mexico-city' }, // Mexico City
    { lat: 59.3293, lon: 18.0686, color: 'gold', id: 'stockholm' }, // Stockholm
  ];
  return (
    <>
      <Header />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {/* Future Canvas component will go here */}
        <div className="h-full w-full flex items-center justify-cente">
          <DenmarkScene />
        </div>
      </Modal>
      <LocationManager />
      <Routes>
        <Route index element={null} />
        <Route path="/item/:itemId" element={null} />
      </Routes>

      <main className="h-full w-full">
        <button
          className="absolute bottom-4 left-4 px-4 py-2 bg-blue-600 text-white rounded-lg z-10"
          onClick={() => setIsOpen(true)}
        >
          Open Modal
        </button>
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 100 }}>
          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            position={[5, 10, 5]}
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <World geoPoints={geoPoints} radius={5} />

          <OrbitControls enablePan={false} />
        </Canvas>
      </main>
    </>
  );
}

export default App;

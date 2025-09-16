import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter, Link, Route, Routes } from 'react-router';

import LocationManager from './LocationManager';
import { AvailableAudioItems } from '../constants';
import SceneManager from './SceneManager';

// Test component that shows current state and allows navigation
const LocationTester = () => {
  return (
    <aside style={{ width: 200, zIndex: 1 }}>
      <LocationManager debug />
      <h2> Test Navigation </h2>
      <Routes>
        <Route index element={null} />
        {AvailableAudioItems.map((item) => (
          <Route key={item.name} path={item.url} element={null} />
        ))}
        <Route path="/" element={null} />
        <Route path="/about" element={null} />
      </Routes>
      <ul>
        <li>
          <Link className="underline text-blue-600 hover:text-blue-800" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="underline text-blue-600 hover:text-blue-800" to="/about">
            About
          </Link>
        </li>
        {AvailableAudioItems.map((item) => (
          <li key={item.name}>
            <Link className="underline text-blue-600 hover:text-blue-800" to={item.url}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const meta: Meta<typeof SceneManager> = {
  title: 'Managers/SceneManager',
  component: SceneManager,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="flex">
          <LocationTester />
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SceneManager>;

export const Default: Story = {
  render: () => <SceneManager />,
};

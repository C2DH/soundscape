import type { Meta, StoryObj } from '@storybook/react';
import NavAudioItems from './NavAudioItems';
import LocationManager from './LocationManager';
import { BrowserRouter } from 'react-router';

const meta: Meta<typeof NavAudioItems> = {
  title: 'Components/NavAudioItems',
  component: NavAudioItems,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
const LocationTester = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <LocationManager debug />
      <NavAudioItems />
    </div>
  );
};

export const WithinRouterContext: Story = {
  render: () => <LocationTester />,
};

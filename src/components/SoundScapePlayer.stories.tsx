import type { Meta, StoryObj } from '@storybook/react'
import { SoundScapePlayer } from './SoundScapePlayer'

const meta: Meta<typeof SoundScapePlayer> = {
  title: 'SoundScape/Player',
  component: SoundScapePlayer,
}

export default meta

type Story = StoryObj<typeof SoundScapePlayer>

export const Default: Story = {
  render: (args) => (
    <div style={{ height: 200, width: '100%' }}>
      <SoundScapePlayer {...args} />
    </div>
  ),
  args: {
    url: '/audio/Italy.mp3',
  },
}

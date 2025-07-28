// AudioPlayer.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import AudioPlayer from './AudioPlayer'

const meta: Meta<typeof AudioPlayer> = {
  title: 'Components/AudioPlayer',
  component: AudioPlayer,
}

export default meta

export const Default: StoryObj<typeof AudioPlayer> = {
  args: {
    src: '/audio/Italy.mp3',
    seek: 0,
  },
}

export const WithSeek: StoryObj<typeof AudioPlayer> = {
  args: {
    src: '/audio/Italy.mp3',
    seek: 5,
  },
}

export const PlayPause: StoryObj<typeof AudioPlayer> = {
  args: {
    src: '/audio/Italy.mp3',
    seek: 0,
  },
}

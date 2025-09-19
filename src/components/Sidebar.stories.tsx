import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router';
import Sidebar from './Sidebar';
import { AvailableAudioItems } from '../constants';
import { useSidebarStore, useStore, useModalStore } from '../store';

type Args = {
  itemId?: string | null;
  isOpenSidebar?: boolean;
  isOpenModal?: boolean;
};

const StoreSetter: React.FC<React.PropsWithChildren<Args>> = ({
  itemId,
  isOpenSidebar,
  isOpenModal,
  children,
}) => {
  useEffect(() => {
    // set Zustand stores for the story
    useSidebarStore.setState({ isOpenSidebar: !!isOpenSidebar });
    useStore.setState({ currentParamItemId: itemId ?? null });
    useModalStore.setState({ isOpenModal: !!isOpenModal });
  }, [itemId, isOpenSidebar, isOpenModal]);
  return <div style={{ width: 360, padding: 12 }}>{children}</div>;
};

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  decorators: [
    (Story, context) => (
      <BrowserRouter>
        <StoreSetter
          itemId={(context.args as Args).itemId}
          isOpenSidebar={(context.args as Args).isOpenSidebar}
          isOpenModal={(context.args as Args).isOpenModal}
        >
          <Story />
        </StoreSetter>
      </BrowserRouter>
    ),
  ],
  argTypes: {
    itemId: {
      control: { type: 'select' },
      options: [null, ...AvailableAudioItems.map((i) => i.id)],
    },
    isOpenSidebar: { control: 'boolean' },
    isOpenModal: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    itemId: AvailableAudioItems[0]?.id ?? null,
    isOpenSidebar: true,
    isOpenModal: true,
  },
};

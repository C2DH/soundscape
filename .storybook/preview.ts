import type { Preview } from '@storybook/react-vite';
import '../src/app.css';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
      // matchers: {
      //   color: /(background|color)$/i,
      //   date: /Date$/i,
      // },
    },
  },
};

export default preview;

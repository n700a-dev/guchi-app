import { extendTheme } from '@chakra-ui/react';
import { Button } from './Button';

const extendedTheme = extendTheme({
  colors: {
    primary: {
      main: 'green',
    },
    black: {
      0: '#ffffff',
    },
    gray: {
      dark: '#444',
    },
  },
  styles: {
    global: {
      'html, body': {
        //color: 'black',
        //bgColor: 'primary.main',
      },
      body: {
        fontSize: {
          base: '14px',
          md: '16px',
        },
      },
    },
  },
  components: {
    Button,
  },
});

export { extendedTheme };

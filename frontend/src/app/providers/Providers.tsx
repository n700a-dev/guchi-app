'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { extendedTheme } from '../../config/chakra/index';
import React from 'react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider theme={extendedTheme}>{children}</ChakraProvider>
    </CacheProvider>
  );
};

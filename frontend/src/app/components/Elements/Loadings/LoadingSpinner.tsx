import React from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

export const LoadingSpinner = ({ style }: { style?: React.CSSProperties }) => (
  <Flex p={4} w="100%" justifyContent="center" alignItems="center" style={style}>
    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
  </Flex>
);

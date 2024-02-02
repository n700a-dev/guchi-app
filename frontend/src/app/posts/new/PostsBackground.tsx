import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { DragArrow } from './dragArrow';

export const PostBackground = () => (
  <Flex p={6} h="100%" w="100%" position="absolute" flexDirection="column" alignItems="center" pointerEvents="none">
    <Text fontSize={16} color="gray">
      カードを上にドラッグしてみよう
    </Text>
    <Flex mt={4} justifyContent="center" userSelect="none" pointerEvents="none" h="30%" w="50%">
      <DragArrow />
    </Flex>
  </Flex>
);

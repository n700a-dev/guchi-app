import React from 'react';
import { Flex } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

export const DeleteIcon = ({
  color,
  borderColor = 'lightgray',
  fontSize = 16,
}: {
  color: string;
  borderColor?: string;
  fontSize?: number;
}) => (
  <Flex alignItems="center" h="100%" p={1} borderRadius={4} borderColor={borderColor} color={color} fontSize={fontSize}>
    <FaTrash />
  </Flex>
);

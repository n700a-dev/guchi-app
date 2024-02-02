import React from 'react';
import { Flex } from '@chakra-ui/react';
import { BiSolidPencil } from 'react-icons/bi';

export const EditIcon = ({
  color,
  borderColor,
  fontSize = 16,
}: {
  color: string;
  borderColor: string;
  fontSize?: number;
}) => (
  <Flex
    alignItems="center"
    h="100%"
    py="3px"
    borderRadius={4}
    borderColor={borderColor}
    color={color}
    fontSize={fontSize + 2}
  >
    <BiSolidPencil />
  </Flex>
);

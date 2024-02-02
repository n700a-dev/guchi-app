import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';

export const IconText = ({
  Icon,
  text,
  onClick,
  fontSize,
  cursor = 'pointer',
  color,
}: {
  Icon: IconType;
  text: string;
  onClick?: () => void;
  fontSize?: number;
  cursor?: string;
  color?: string;
}) => (
  <Flex cursor={cursor} alignItems="center" fontSize={fontSize} color={color} onClick={onClick}>
    <Icon />
    <Text ml={2}>{text}</Text>
  </Flex>
);

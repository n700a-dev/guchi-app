import React, { ReactNode } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { IconText } from './IconText';
import { Box } from '@chakra-ui/react';

const SlotHref = ({ children, href }: { children: ReactNode; href?: string }) => {
  return <>{href ? <a href={href}>{children}</a> : <>{children}</>}</>;
};
export const AleartMessage = ({
  message,
  href,
  onClick,
  cursor,
}: {
  message: string;
  href?: string;
  onClick?: () => void;
  cursor?: string;
}) => {
  return (
    <Box w="100%" my={4} p={4} borderRadius={8} borderWidth={1} borderColor="black.0" onClick={onClick} cursor={cursor}>
      <SlotHref href={href}>
        <IconText Icon={FiAlertTriangle} text={message} />
      </SlotHref>
    </Box>
  );
};

import React from 'react';
import { Button, Link } from '@chakra-ui/react';
import { Routes } from '../../config/routes';

export const StartButton = ({ buttonText }: { buttonText: string }) => {
  return (
    <Link href={Routes.posts.new} style={{ width: '100%', maxWidth: '480px' }}>
      <Button
        p={6}
        w="100%"
        bgColor="black.0"
        boxShadow="5px 5px 2px rgba(0,0,0,0.3);"
        _hover={{ bgColor: 'lightyellow' }}
        color="gray"
        fontWeight={700}
      >
        {buttonText}
      </Button>
    </Link>
  );
};

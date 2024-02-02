import { Flex } from '@chakra-ui/react';
import { LoginButton } from '../../login/LoginButton';
import React from 'react';

export const NotLoggedInPanel = () => {
  return (
    <Flex w="100%" flexDirection="column" justifyContent="center">
      <Flex w="100%" justifyContent="center" my={6}>
        クラウドを利用すると、 複数端末でグチを見ることができます。 分析機能も利用できます。
      </Flex>
      <LoginButton />
    </Flex>
  );
};

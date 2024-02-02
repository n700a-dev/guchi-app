import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { ImNotification } from 'react-icons/im';

export const NoPostFoundPanel = () => {
  return (
    <Flex direction="column" alignItems="center" w="100%" h="100%" borderWidth="1px" borderRadius={8} p={4}>
      <Box>
        <Box>この端末にグチはありません。</Box>
      </Box>
      <Box mt={4}>
        <Flex alignItems="center">
          <ImNotification />
          <Box ml={2}>ブラウザの履歴を消すと端末のグチは消えるため、ログインをおすすめします！</Box>
        </Flex>
      </Box>
    </Flex>
  );
};

import React, { ReactNode } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import ErrorBoundary from '../../ErrorBouondary';
import { HamburgerMenu } from './components/Elements/Menus';
import { BalloonMenu } from './components/Elements/Menus/BalloonMenu';

/*
 * ログイン後にAPIと通信を行うコンポーネントで使用する (Strict Mode)
 */
export const StrictModeBoundary = ({ children }: { children: React.ReactNode }) => (
  <React.StrictMode>{children}</React.StrictMode>
);

const Header = () => {
  return (
    <Flex bgColor="gray" w="100%" justifyContent="space-between">
      <Flex justifyContent="center" alignItems="center" h="100%" pl={4}>
        <HamburgerMenu />
      </Flex>
      <Flex position="relative" w="100%" justifyContent="center" alignItems="center">
        <Link href="/">
          <Text fontSize={32} fontWeight="700" color="lightgray" style={{ letterSpacing: '2px' }}>
            グチログ
          </Text>
        </Link>
      </Flex>
      <Flex justifyContent="center" alignItems="center" h="100%" pr={4}>
        <BalloonMenu />
      </Flex>
    </Flex>
  );
};

const Body = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgColor="lightgray"
      w="100%"
      flex="1 1 auto"
      overflow="auto"
    >
      <Flex justifyContent="center" w="100%" flex="1 1 auto" overflow="auto" p={4}>
        <Box w="100%" maxW="768px" h="100%">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

const MainLayout = ({ children }: { children: ReactNode }) => (
  <StrictModeBoundary>
    <ErrorBoundary>
      <Flex direction="column" w="100vw" h="100dvh">
        <Header></Header>
        <Body>{children}</Body>
      </Flex>
    </ErrorBoundary>
  </StrictModeBoundary>
);

export default MainLayout;

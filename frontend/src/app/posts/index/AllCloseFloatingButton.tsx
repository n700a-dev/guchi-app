import { Flex, Box } from '@chakra-ui/react';
import { IoArrowUpCircleOutline } from 'react-icons/io5';

export const AllCloseFloatingButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Flex
      w="100%"
      h="50px"
      justifyContent="center"
      position="fixed"
      bottom="32px"
      right={-2}
      pointerEvents="none"
      zIndex={3}
    >
      <Box w="100%" h="100%" maxW="768px" mr={8}>
        <Flex
          w="48px"
          h="48px"
          borderRadius="50%"
          marginLeft="auto"
          justifyContent="center"
          alignItems="center"
          bgColor="black.0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
          }}
          pointerEvents="auto"
          cursor="pointer"
          boxShadow="5px 5px 2px rgba(0,0,0,0.3);"
        >
          <IoArrowUpCircleOutline fontSize="42px" />
        </Flex>
      </Box>
    </Flex>
  );
};

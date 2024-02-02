import { Flex, Box, Divider } from '@chakra-ui/react';
import React from 'react';

const ARROW_WIDTH = 20;

export const DragArrow = React.memo(() => {
  return (
    <Flex flexDirection="column" width={`${ARROW_WIDTH * 2}px`} height="100%" alignItems="center">
      <Box
        style={{
          width: '0px',
          height: '0px',
          borderLeft: `${ARROW_WIDTH}px solid transparent`,
          borderRight: `${ARROW_WIDTH}px solid transparent`,
          borderBottom: `${ARROW_WIDTH}px solid gray`,
        }}
      />

      <Divider borderWidth={5} borderColor="gray" orientation="vertical" variant="dashed" flex="1 1 auto" />
    </Flex>
  );
});
DragArrow.displayName = 'DragArrow';

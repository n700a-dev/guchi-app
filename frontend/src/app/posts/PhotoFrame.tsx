import { Box, Image } from '@chakra-ui/react';
import React from 'react';

export const PhotoFrame = ({ image, style }: { image: string | undefined; style?: React.CSSProperties }) => {
  return (
    <Box style={style}>
      {image && (
        <Box>
          <Image userSelect="none" pointerEvents="none" src={image} alt="投稿画像" borderRadius={4} />
        </Box>
      )}
    </Box>
  );
};

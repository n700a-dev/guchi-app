import React from 'react';
import { Box } from '@chakra-ui/react';
import { EmotionIcons, TEmotion } from './EmotionSelector';

export const EmotionIndicator = ({
  emotion,
  style,
  hasBlankSpace = false,
}: {
  emotion: TEmotion;
  style?: React.CSSProperties;
  hasBlankSpace?: boolean;
}) => {
  // NOTE: undefinedの場合はhappyにFallbackする
  const EmotionComponent = emotion ? EmotionIcons[emotion] : EmotionIcons.happy;
  return (
    <>
      {emotion ? (
        <Box fontSize={16} color="gray" style={style}>
          <EmotionComponent />
        </Box>
      ) : (
        <>{hasBlankSpace && <Box width="25px"></Box>}</>
      )}
    </>
  );
};

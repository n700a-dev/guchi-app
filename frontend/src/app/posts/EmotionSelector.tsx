import React, { useCallback } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FaRegLaughBeam, FaRegSadTear, FaRegAngry, FaRegTired } from 'react-icons/fa';

type EmotionEnum = 'happy' | 'angry' | 'sad' | 'tired';
const EmotionKeys = ['happy',  'angry', 'sad','tired'] as const;

export const EmotionIcons: Record<EmotionEnum, IconType> = {
  happy: FaRegLaughBeam,
  angry: FaRegAngry,
  sad: FaRegSadTear,
  tired: FaRegTired,
} as const;

export const EmotionTexts: Record<EmotionEnum, string> = {
  happy: '楽しい',
  angry: '怒った',
  sad: '悲しい',
  tired: '疲れた',
} as const;

export type TEmotion = keyof typeof EmotionIcons | undefined;

const EmotionText = ({ emotion }: { emotion: TEmotion }) => {
  return (
    <Box color="gray" fontSize="16px">
      {emotion ? <Text>{EmotionTexts[emotion]}</Text> : <Text>なし</Text>}
    </Box>
  );
};

const EmotionIcon = ({
  iconKey,
  emotion,
  assignEmotion,
}: {
  iconKey: TEmotion;
  emotion: TEmotion;
  assignEmotion: (newEmotion: TEmotion) => void;
}) => {
  const activeColor = 'gray';
  const inActiveColor = 'lightgray';
  if (!iconKey) return <></>;
  const Component = EmotionIcons[iconKey];

  return (
    <Flex justifyContent="center">
      {emotion === iconKey && (
        <Box position="absolute" top={1}>
          <EmotionText emotion={emotion} />
        </Box>
      )}
      <Text
        color={emotion === iconKey ? activeColor : inActiveColor}
        onClick={() => assignEmotion(iconKey as TEmotion)}
        cursor="pointer"
      >
        <Component />
      </Text>
    </Flex>
  );
};

export const EmotionSelector = ({
  emotion,
  setEmotion,
}: {
  emotion: TEmotion;
  setEmotion: (emotion: TEmotion) => void;
  activeColor?: string;
  inActiveColor?: string;
}) => {
  const assignEmotion = useCallback(
    (newEmotion: TEmotion) => {
      newEmotion === emotion ? setEmotion(undefined) : setEmotion(newEmotion);
    },
    [emotion, setEmotion],
  );

  return (
    <Flex mt={2} gap={4} fontSize={26}>
      {EmotionKeys.map((key) => (
        <Box key={key}>
          <EmotionIcon iconKey={key} emotion={emotion} assignEmotion={assignEmotion} />
        </Box>
      ))}
    </Flex>
  );
};

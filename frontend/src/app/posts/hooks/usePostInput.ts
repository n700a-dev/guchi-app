import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TEmotion } from '../EmotionSelector';

import { EMOTION_INPUT_NAME, IMAGE_BASE64_INPUT_NAME, PostSchema } from '../consts/postSchema';
import { TPostInput } from '../new/page';

export const usePostInput = ({
  sendPost,
  onClose,
  isOpen,
}: {
  sendPost: (editedPost: TPostInput) => void;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const methods = useForm<TPostInput>({ resolver: zodResolver(PostSchema) });

  useEffect(() => {
    methods.reset();
  }, [methods, isOpen]);

  const image = methods.watch(IMAGE_BASE64_INPUT_NAME);
  const emotion = methods.watch(EMOTION_INPUT_NAME);

  const onSubmit = useCallback(
    (data: z.infer<typeof PostSchema>) => {
      sendPost({
        text: data.text,
        emotion: (data.emotion as TEmotion) ?? undefined,
        imageBase64: data.imageBase64,
        imageUrl: undefined,
      });

      onClose();
    },
    [onClose, sendPost],
  );

  const handleSubmit = methods.handleSubmit(onSubmit);

  const setImage = useCallback(
    (image: string) => {
      methods.setValue(IMAGE_BASE64_INPUT_NAME, image);
    },
    [methods],
  );

  const setEmotion = useCallback(
    (emotion: TEmotion) => {
      methods.setValue(EMOTION_INPUT_NAME, emotion);
    },
    [methods],
  );

  return {
    emotion,
    image,
    handleSubmit,
    setEmotion,
    setImage,
    methods,
  };
};

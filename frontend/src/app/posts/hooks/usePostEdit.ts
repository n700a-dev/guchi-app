import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TEmotion } from '../EmotionSelector';
import { EMOTION_INPUT_NAME, IMAGE_BASE64_INPUT_NAME, IMAGE_URL_INPUT_NAME, PostSchema } from '../consts/postSchema';
import { TPostInput } from '../new/page';

export const usePostEdit = ({
  post,
  sendPost,
  isOpen,
  onClose,
}: {
  post: TPostInput;
  sendPost: (editedPost: TPostInput) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const methods = useForm<TPostInput>({ resolver: zodResolver(PostSchema), defaultValues: { ...post } });

  useEffect(() => {
    methods.reset({ ...post });
  }, [methods, post, isOpen]);

  const imageBase64 = methods.watch(IMAGE_BASE64_INPUT_NAME);
  const imageUrl = methods.watch(IMAGE_URL_INPUT_NAME);

  const emotion = methods.watch(EMOTION_INPUT_NAME);

  const onSubmit = useCallback(
    (data: z.infer<typeof PostSchema>) => {
      sendPost({
        text: data.text,
        emotion: (data.emotion as TEmotion) ?? undefined,
        imageBase64: data.imageBase64,
        imageUrl: data.imageUrl,
      });
      onClose();
    },
    [onClose, sendPost],
  );

  const setImage = useCallback(
    (image: string) => {
      methods.setValue(IMAGE_BASE64_INPUT_NAME, image);
      methods.setValue(IMAGE_URL_INPUT_NAME, undefined);
    },
    [methods],
  );

  const setEmotion = useCallback(
    (emotion: TEmotion) => {
      methods.setValue(EMOTION_INPUT_NAME, emotion);
    },
    [methods],
  );

  const handleSubmit = methods.handleSubmit(onSubmit);

  return {
    emotion,
    image: imageUrl ?? imageBase64,
    handleSubmit,
    setEmotion,
    setImage,
    methods,
  };
};

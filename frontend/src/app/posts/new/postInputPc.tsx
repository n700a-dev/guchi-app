import {
  Text,
  Flex,
  Button,
  Textarea,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useCallback, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { EmotionSelector, TEmotion } from '../EmotionSelector';
import { CameraInput } from '../CameraInput';
import { TPost } from './page';
import { generateRandomId } from '../functions/postsManipulation';
import { z } from 'zod';
import { FieldErrors, FormProvider, get, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '../ErrorMessage';
import { EMOTION_INPUT_NAME, IMAGE_BASE64_INPUT_NAME, PostSchema, TEXT_INPUT_NAME } from '../consts/postSchema';

type TPostInputInnerProps = {
  sendPost: (post: TPost) => void;
  emotion: TEmotion;
  setEmotion: (emotion: TEmotion) => void;
  imageBase64: string | undefined;
  setImage: (image: string) => void;
};

const PostInputMobile = ({ sendPost, emotion, setEmotion, imageBase64, setImage }: TPostInputInnerProps) => {
  const { register, handleSubmit, reset, setFocus, formState, setValue } = useFormContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const clearInputs = useCallback(() => {
    reset();
    setValue(TEXT_INPUT_NAME, '');
  }, [reset, setValue]);

  const openWithFocus = useCallback(() => {
    onOpen();
    setTimeout(() => {
      setFocus(TEXT_INPUT_NAME);
    }, 200);
  }, [onOpen, setFocus]);

  const onSubmit = useCallback(
    (data: z.infer<typeof PostSchema>) => {
      sendPost({
        tId: generateRandomId(),
        text: data.text,
        emotion: (data.emotion as TEmotion) ?? undefined,
        imageBase64: data.imageBase64 ?? undefined,
        imageUrl: undefined,
      });

      clearInputs();
      onClose();
    },
    [clearInputs, onClose, sendPost],
  );

  const onSubmitError = useCallback((errors: FieldErrors) => {
    console.log('e', errors);
  }, []);

  const onCancel = useCallback(() => {
    clearInputs();
    onClose();
  }, [clearInputs, onClose]);

  return (
    <>
      <Button onClick={openWithFocus} p={6} mb={4} bgColor="gray" color="black.0" _hover={{ bgColor: '#c1c1c1' }}>
        グチをつぶやく
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bottom={0}>
          <ModalBody p={6}>
            <Flex justifyContent="space-between" mb={2}>
              <EmotionSelector emotion={emotion} setEmotion={setEmotion} />
              <Flex justifyContent="flex-end">
                <Button variant="outline" mr={2} borderColor="lightgray" onClick={onCancel}>
                  キャンセル
                </Button>
                <Button colorScheme="blue" onClick={handleSubmit(onSubmit, onSubmitError)}>
                  確定
                </Button>
              </Flex>
            </Flex>
            <Textarea
              placeholder="グチをつぶやこう！"
              rows={3}
              borderColor="lightgray"
              focusBorderColor="lightgray"
              _hover={{ borderColor: 'lightgray' }}
              {...register(TEXT_INPUT_NAME)}
            ></Textarea>
            <ErrorMessage error={get(formState.errors, TEXT_INPUT_NAME)} />
            <CameraInput style={{ marginTop: '16px' }} imageSrc={imageBase64} setImageSrc={setImage} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const PostInputPC = ({ sendPost, emotion, setEmotion, imageBase64 }: TPostInputInnerProps) => {
  const postRef = useRef<HTMLTextAreaElement>(null);

  const submit = useCallback(() => {
    if (!postRef.current?.value) return;
    sendPost({
      tId: generateRandomId(),
      text: postRef.current.value,
      emotion: emotion,
      imageBase64,
      imageUrl: undefined,
    });
    postRef.current.value = '';
  }, [emotion, imageBase64, sendPost]);

  const handleSubmit = useCallback(() => {
    const result = PostSchema.safeParse({ text: 'onSubmit', image: 'uge' });
    console.log('submit ', result);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        submit();
      }
    },
    [submit],
  );
  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-end" mb={2}>
        <EmotionSelector emotion={emotion} setEmotion={setEmotion} activeColor="gray" inActiveColor="#ececec" />
        <Flex justifyContent="flex-end" alignItems="flex-end">
          <Text fontSize="12">Shift + Enter で確定</Text>
          <Button size="sm" colorScheme="teal" onClick={handleSubmit} ml={2}>
            確定
          </Button>
        </Flex>
      </Flex>
      <Textarea
        placeholder="グチをつぶやこう！"
        onKeyDown={onKeyDown}
        ref={postRef}
        rows={3}
        bgColor="black.0"
      ></Textarea>
    </>
  );
};

type TPostInputProps = {
  sendPost: (post: TPost) => void;
};

export const PostInput = ({ sendPost }: TPostInputProps) => {
  const methods = useForm({ resolver: zodResolver(PostSchema) });

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

  return (
    <FormProvider {...methods}>
      {isMobile ? (
        <PostInputMobile
          imageBase64={methods.watch(IMAGE_BASE64_INPUT_NAME)}
          setImage={setImage}
          sendPost={sendPost}
          emotion={methods.watch(EMOTION_INPUT_NAME)}
          setEmotion={setEmotion}
        />
      ) : (
        <PostInputPC
          imageBase64={methods.watch(IMAGE_BASE64_INPUT_NAME)}
          setImage={setImage}
          sendPost={sendPost}
          emotion={methods.watch(EMOTION_INPUT_NAME)}
          setEmotion={setEmotion}
        />
      )}
    </FormProvider>
  );
};

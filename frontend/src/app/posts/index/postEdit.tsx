import { Text, Button, Textarea, Modal, ModalBody, ModalContent, ModalOverlay, Box, Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { EmotionSelector } from '../EmotionSelector';
import { CameraInput } from '../CameraInput';
import { usePostEdit } from '../hooks/usePostEdit';
import { TEXT_INPUT_NAME } from '../consts/postSchema';
import { TPostInput } from '../new/page';
import { ErrorMessage } from '../ErrorMessage';
import { get } from 'react-hook-form';
import { usePasteUrl } from '../hooks/usePasteUrl';

export const PostEdit = ({
  sendPost,
  post,
  isOpen,
  onClose,
}: {
  sendPost: (editedPost: TPostInput) => void;
  post: TPostInput;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { handleSubmit, emotion, image, setEmotion, setImage, methods } = usePostEdit({
    post,
    sendPost,
    isOpen,
    onClose,
  });
  const { onPaste } = usePasteUrl(methods);

  useEffect(() => {
    setTimeout(() => {
      methods.setFocus(TEXT_INPUT_NAME);
    }, 200);
  }, [isOpen, methods]);

  return (
    <Box h="auto" w="100%">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bottom={0}>
          <ModalBody p={6}>
            <Flex justifyContent="space-between" mb={2}>
              <EmotionSelector emotion={emotion} setEmotion={setEmotion} />
              <Flex justifyContent="flex-end">
                <Button variant="outline" px={1} mr={2} borderColor="lightgray" onClick={onClose}>
                  キャンセル
                </Button>
                <Button colorScheme="blue" onClick={handleSubmit}>
                  確定
                </Button>
              </Flex>
            </Flex>
            <Flex mb={2}>
              <Text fontWeight="700">グチを編集</Text>
            </Flex>
            <Textarea
              {...methods.register(TEXT_INPUT_NAME)}
              placeholder="グチを編集する"
              rows={3}
              borderColor="lightgray"
              _hover={{ borderColor: 'lightgray' }}
              wordBreak="break-all"
              onPaste={onPaste}
            ></Textarea>
            <ErrorMessage error={get(methods.formState.errors, TEXT_INPUT_NAME)} />
            <CameraInput imageSrc={image} setImageSrc={setImage} style={{ marginTop: '16px' }} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

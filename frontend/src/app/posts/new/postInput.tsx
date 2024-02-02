import {
  Flex,
  Text,
  Button,
  Textarea,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { EmotionSelector } from '../EmotionSelector';
import { CameraInput } from '../CameraInput';
import { get } from 'react-hook-form';
import { ErrorMessage } from '../ErrorMessage';
import { TEXT_INPUT_NAME } from '../consts/postSchema';
import { usePostInput } from '../hooks/usePostInput';
import { TPostInput } from './page';
import { usePasteUrl } from '../hooks/usePasteUrl';
import { StartPostButton } from '../StartPostButton';
import { useLocalPostCountValidation } from './hooks/useLocalPostCountValidation';
import { useGoogleOAuth2 } from '@/app/login/useGoogleOAuth2';

const InputModalContent = ({
  sendPost,
  isOpen,
  onClose,
}: TPostInputProps & { isOpen: boolean; onClose: () => void }) => {
  const { emotion, image, methods, handleSubmit, setEmotion, setImage } = usePostInput({ sendPost, onClose, isOpen });

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => {
      methods.setFocus(TEXT_INPUT_NAME);
    }, 200);
  }, [isOpen, methods]);

  const { onPaste } = usePasteUrl(methods);

  return (
    <Modal isOpen={isOpen} onClose={handleSubmit}>
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
          <Textarea
            placeholder="グチをつぶやこう！"
            rows={3}
            borderColor="lightgray"
            focusBorderColor="lightgray"
            _hover={{ borderColor: 'lightgray' }}
            {...methods.register(TEXT_INPUT_NAME)}
            onPaste={onPaste}
            wordBreak="break-all"
          ></Textarea>
          <ErrorMessage error={get(methods.formState.errors, TEXT_INPUT_NAME)} />
          <CameraInput style={{ marginTop: '16px' }} imageSrc={image} setImageSrc={setImage} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ErrorModalContent = ({
  errorMessage,
  action,
  isOpen,
  onClose,
}: { errorMessage?: string; action?: string } & { isOpen: boolean; onClose: () => void }) => {
  const { goToOAuth2Endpoint } = useGoogleOAuth2();

  const redirectToLogin = useCallback(() => {
    goToOAuth2Endpoint();
  }, [goToOAuth2Endpoint]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bottom={0}>
        <ModalBody p={6}>
          <Text>{errorMessage}</Text>
        </ModalBody>
        <ModalFooter pt={0}>
          <Button variant="outline" onClick={onClose} mr={2} borderColor="lightgray">
            閉じる
          </Button>
          {action === 'login' && <Button onClick={redirectToLogin}>ログイン</Button>}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

type TPostInputProps = {
  sendPost: (post: TPostInput) => void;
};

export const PostInput = ({ sendPost }: TPostInputProps) => {
  const { errorMessage, action } = useLocalPostCountValidation();
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <>
      <Box pb={6}>
        <StartPostButton onClick={onOpen} />
      </Box>
      {errorMessage ? (
        <ErrorModalContent errorMessage={errorMessage} action={action} isOpen={isOpen} onClose={onClose} />
      ) : (
        <InputModalContent sendPost={sendPost} isOpen={isOpen} onClose={onClose} />
      )}
    </>
  );
};

import {
  Box,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import React, { ReactNode, useCallback } from 'react';

type TConfirmModalProps = {
  question: string;
  onExec: () => void;
  onExecText: string;
  ModalOpenTrigger: ReactNode;
};

export const ConfirmModal = ({ question, onExec, onExecText, ModalOpenTrigger }: TConfirmModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onExecAndClose = useCallback(() => {
    onExec();
    onClose();
  }, [onExec, onClose]);

  return (
    <>
      <Box
        onClick={(e) => {
          e.preventDefault();
          onOpen();
        }}
      >
        {ModalOpenTrigger}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bottom={0}>
          <ModalBody p={6}>
            <Text>{question}</Text>
          </ModalBody>
          <ModalFooter pt={0}>
            <Button variant="outline" onClick={onClose} mr={2} borderColor="lightgray">
              キャンセル
            </Button>
            <Button colorScheme="red" onClick={onExecAndClose}>
              {onExecText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

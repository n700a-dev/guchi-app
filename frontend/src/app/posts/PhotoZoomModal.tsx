import {
  Box,
  Button,
  Image,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { RxCrossCircled } from 'react-icons/rx';

type TPhotoZoomModalProps = {
  children: ReactNode;
  image: string;
  description?: string;
};

export const PhotoZoomModal = ({ children, image, description }: TPhotoZoomModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        cursor="pointer"
        onClick={(e) => {
          e.preventDefault();
          onOpen();
        }}
      >
        {children}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bottom={0} maxWidth="768px">
          <ModalBody display="flex" flexDirection="column" alignItems="center" p={4}>
            <Image src={image} alt="zoom" w="100%" borderRadius={4} />
            {description && <Text mt={4}>{description}</Text>}
          </ModalBody>
          <ModalFooter pt={0} display="flex" justifyContent="center">
            <Button variant="outline" onClick={onClose} borderColor="lightgray">
              <RxCrossCircled size={20} />
              <Text ml={2} as="span">
                閉じる
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

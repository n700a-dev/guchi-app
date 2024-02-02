import React, { useContext } from 'react';
import { Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, useDisclosure } from '@chakra-ui/react';

import { PostEdit } from './postEdit';
import { ConfirmModal } from '../ConfirmModal';
import { questionBeforeDelete } from '../functions/postConfirmationMessage';
import { PostManipulationContext } from './providers/PostManipulationProvider';
import { IPostDB } from '@/app/utils/db';
import { IconText } from '@/app/components/Elements/Texts';
import { FaTrash } from 'react-icons/fa';
import { BiSolidPencil } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { TwitterShareButton } from 'react-share';
import { FaSquareXTwitter } from 'react-icons/fa6';

const MENU_BUTTON_SIZE = '32px';
export const PostEditMenu = ({ post }: { post: IPostDB }) => {
  const { updatePost, deletePost } = useContext(PostManipulationContext);
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();

  if (!updatePost || !deletePost) {
    return <></>;
  }

  return (
    <Menu>
      <MenuButton
        h={MENU_BUTTON_SIZE}
        w={MENU_BUTTON_SIZE}
        as={IconButton}
        aria-label="Options"
        icon={<BsThreeDotsVertical />}
        variant="outline"
        _hover={{
          bgColor: 'gray',
          color: 'black.0',
        }}
      />
      <MenuList fontSize={16} color="gray.dark" width="200px" minW="0" zIndex={2}>
        <Stack spacing={2}>
          <MenuItem onClick={onOpenEdit}>
            <Box w="100%">
              <IconText Icon={BiSolidPencil} text="編集" />
            </Box>
            <PostEdit
              post={post}
              sendPost={(editedPost) => updatePost?.(post.createdAtMs, editedPost)}
              isOpen={isOpenEdit}
              onClose={onCloseEdit}
            />
          </MenuItem>
          {post.text && (
            <TwitterShareButton title={post.text} url="https://guchi-log.net" hashtags={['グチログ']}>
              <MenuItem>
                <IconText Icon={FaSquareXTwitter} text="Xに投稿" />
              </MenuItem>
            </TwitterShareButton>
          )}
          <ConfirmModal
            ModalOpenTrigger={
              <MenuItem>
                <Box cursor="pointer">
                  <IconText Icon={FaTrash} text="削除" color="red" />
                </Box>
              </MenuItem>
            }
            question={questionBeforeDelete(post)}
            onExecText="削除"
            onExec={() => deletePost?.(post.createdAtMs)}
          ></ConfirmModal>
        </Stack>
      </MenuList>
    </Menu>
  );
};

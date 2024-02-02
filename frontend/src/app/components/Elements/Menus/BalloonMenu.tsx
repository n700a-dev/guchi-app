import React, { useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';

import { TokenContext } from '@/app/providers/TokenProvider';
import { FaRegUser, FaUser } from 'react-icons/fa6';
import { IconText } from '../Texts';
import { LogoutButton } from '@/app/login/LogoutButton';
import { LoginButton } from '@/app/login/LoginButton';
import { useCurrentUserQuery } from '@/gql/graphql';

const MENU_BUTTON_SIZE = '32px';
export const BalloonMenu = () => {
  const { isLoggedIn } = useContext(TokenContext);
  const [{ data }, fetch] = useCurrentUserQuery({ pause: true });

  const nickname = data?.currentUser?.nickname ?? 'ログインユーザー';

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch({
      context: {
        pause: false,
      },
    });
  }, [fetch, isLoggedIn]);

  return (
    <Box position="relative" zIndex={100} mr={2}>
      <Box position="fixed">
        <Popover>
          <PopoverTrigger>
            {isLoggedIn ? (
              <Button
                boxSizing="border-box"
                h={MENU_BUTTON_SIZE}
                px={2}
                color="gray.dark"
                bgColor="black.0"
                borderColor="black.0"
                borderWidth="1px"
              >
                <FaUser />
              </Button>
            ) : (
              <Button
                boxSizing="border-box"
                h={MENU_BUTTON_SIZE}
                px={2}
                color="gray.dark"
                bgColor="gray"
                borderColor="gray.dark"
                borderWidth="1px"
              >
                <FaUser />
              </Button>
            )}
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>
                <IconText Icon={FaRegUser} text={isLoggedIn ? `${nickname} さん` : 'ログインしていません'} />
              </PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>{isLoggedIn ? <LogoutButton /> : <LoginButton />}</PopoverBody>
              <PopoverFooter></PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>
      </Box>
      {/* Menuボタンのスペース確保用のダミー要素 */}
      <Box w={MENU_BUTTON_SIZE} h={MENU_BUTTON_SIZE}></Box>
    </Box>
  );
};

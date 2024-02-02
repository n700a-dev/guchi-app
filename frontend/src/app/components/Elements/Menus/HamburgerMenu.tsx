import React from 'react';
import { Box, IconButton, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Stack } from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';

import Link from 'next/link';
import { IconText } from '../Texts';
import { PageIcons, Routes } from '../../../../config/routes';

const MENU_BUTTON_SIZE = '32px';
export const HamburgerMenu = () => (
  <Box position="relative" zIndex={100}>
    <Box position="fixed">
      <Menu>
        <MenuButton
          h={MENU_BUTTON_SIZE}
          w={MENU_BUTTON_SIZE}
          as={IconButton}
          aria-label="Options"
          icon={<GiHamburgerMenu />}
          variant="outline"
          color="black.0"
          _hover={{
            bgColor: 'white',
            color: 'gray.dark',
          }}
          _active={{
            bgColor: 'black.0',
            color: 'gray.dark',
          }}
        />
        <MenuList fontSize={16} width="300px" color="gray.dark">
          <Stack spacing={2}>
            <MenuGroup>
              <Link href={Routes.posts.new}>
                <MenuItem>
                  <IconText Icon={PageIcons.posts.new} text="つぶやく" />
                </MenuItem>
              </Link>
              <Link href={Routes.posts.index}>
                <MenuItem>
                  <IconText Icon={PageIcons.posts.index} text="グチ履歴" />
                </MenuItem>
              </Link>
              <Link href={Routes.posts.analysis}>
                <MenuItem>
                  <IconText Icon={PageIcons.posts.analysis} text="グチ分析" />
                </MenuItem>
              </Link>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup>
              <Link href={Routes.settings.root}>
                <MenuItem>
                  <IconText Icon={PageIcons.settings.root} text="設定" />
                </MenuItem>
              </Link>
              <Link href={Routes.terms.root}>
                <MenuItem>
                  <IconText Icon={PageIcons.terms.root} text="利用規約" />
                </MenuItem>
              </Link>
              <Link href={Routes.inquiry.googleForm} target="_blank">
                <MenuItem>
                  <IconText Icon={PageIcons.inquiry.googleForm} text="お問い合わせ" />
                </MenuItem>
              </Link>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup>
              <Link href={Routes.install.root}>
                <MenuItem>
                  <IconText Icon={PageIcons.install.root} text="アプリインストール" />
                </MenuItem>
              </Link>
            </MenuGroup>
          </Stack>
        </MenuList>
      </Menu>
    </Box>
    {/* Menuボタンのスペース確保用のダミー要素 */}
    <Box w={MENU_BUTTON_SIZE} h={MENU_BUTTON_SIZE}></Box>
  </Box>
);

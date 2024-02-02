'use client';

import { Text, Flex, Heading, UnorderedList, ListItem, Link, Box } from '@chakra-ui/react';
import React, { useCallback, useContext } from 'react';

import { FaBomb } from 'react-icons/fa';
import { IoArrowUndoOutline } from 'react-icons/io5';
import MainLayout from '../MainLayout';
import { ConfirmModal } from '../posts/ConfirmModal';
import { deleteAllPostsDB } from '../posts/functions/postDBManipulation';
import { Routes } from '../../config/routes';
import { FaUserAltSlash } from 'react-icons/fa';
import { useWithdrawCurrentUserMutation } from '@/gql/graphql';
import { TokenContext } from '../providers/TokenProvider';

const Settings = () => {
  const { isLoggedIn, dispatch } = useContext(TokenContext);
  const [mState, withdraw] = useWithdrawCurrentUserMutation();

  const withdrawCurrentUser = useCallback(async () => {
    if (mState.fetching) return;
    const result = await withdraw({});
    if (result.error) {
      alert('退会に失敗しました。');
      return;
    }
    alert('退会しました。再入会するには、ログインをクリックしてください。');
    dispatch?.({ type: 'remove' });
  }, [dispatch, mState.fetching, withdraw]);

  return (
    <MainLayout>
      <Flex>
        <Heading as="h2" color="gray" fontSize={28}>
          設定
        </Heading>
      </Flex>
      <UnorderedList py={4} spacing={2} color="gray.dark" fontSize="16px">
        <ListItem>
          <ConfirmModal
            ModalOpenTrigger={
              <Flex cursor="pointer" alignItems="center" _hover={{ textDecoration: 'underline' }}>
                <FaBomb />
                <Text ml={2}>この端末のグチを全削除</Text>
              </Flex>
            }
            question="この端末のグチを全て削除します。この操作は取り消せません。よろしいですか？"
            onExecText="全削除"
            onExec={() => {
              deleteAllPostsDB();
              alert('グチを全削除しました');
            }}
          ></ConfirmModal>
        </ListItem>
        {isLoggedIn ? (
          <ListItem>
            <ConfirmModal
              ModalOpenTrigger={
                <Flex cursor="pointer" alignItems="center" _hover={{ textDecoration: 'underline' }}>
                  <FaUserAltSlash />
                  <Text ml={2}>退会</Text>
                </Flex>
              }
              question="このサービスから退会し、全てのデータが利用できなくなります。この操作は取り消せません。よろしいですか？"
              onExecText="サービスから退会"
              onExec={() => {
                deleteAllPostsDB();
                withdrawCurrentUser();
              }}
            ></ConfirmModal>
          </ListItem>
        ) : (
          <Box>(ログインしていません)</Box>
        )}
      </UnorderedList>
      <Flex mt={6}>
        <Heading as="h2" color="gray" fontSize={28}>
          戻る
        </Heading>
      </Flex>
      <UnorderedList py={4} spacing={2} color="gray.dark" fontSize="16px">
        <ListItem>
          <Link href={Routes.posts.index}>
            <Flex cursor="pointer" alignItems="center">
              <IoArrowUndoOutline />
              <Text ml={2}>グチ履歴に戻る</Text>
            </Flex>
          </Link>
        </ListItem>
      </UnorderedList>
      <Box position="absolute" bottom={4}>
        version: 0.4 β版（2024/1/30）
      </Box>
    </MainLayout>
  );
};

export default Settings;

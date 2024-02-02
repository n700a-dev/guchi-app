'use client';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import MainLayout from '../../MainLayout';
import { Box, Flex, Switch, Text } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { isMobile } from 'react-device-detect';

import Posts from './posts';
import { findPostById, generateRandomId } from '../functions/postsManipulation';
import Link from 'next/link';
import { PostInput } from './postInput';
import { TEmotion } from '../EmotionSelector';
import { useAnimate } from 'framer-motion';
import { deletePostDB, insertPostDB } from '../functions/postDBManipulation';
import { LS_IS_AUTO_FIRING, LS_IS_POSTED } from '../consts/localStorage';
import { BsFire } from 'react-icons/bs';
import { IconText } from '../../components/Elements/Texts';
import { TokenContext } from '@/app/providers/TokenProvider';
import { usePostBackend } from '../hooks/api/repository/usePostBackend';
import { getUnixMs } from '@/app/utils/datetime';
import { useFiredPostCount } from './hooks/useFiredPostCount';
import { PageIcons, Routes } from '../../../config/routes';

const MAX_STAGING_POST_COUNT = 5; // 燃やしていないグチを溜められる個数

type TStatusBarProps = {
  firedPostCount: number;
  isAutoFiring: boolean;
  toggleAutoFiring: () => void;
};
const StatusBar = ({ firedPostCount, isAutoFiring, toggleAutoFiring }: TStatusBarProps) => {
  const [scope, animate] = useAnimate();
  const [isAnimationBlocked, setIsAnimationBlocked] = useState(true);

  setTimeout(() => {
    setIsAnimationBlocked(false);
  }, 500);

  useEffect(() => {
    if (isAnimationBlocked) {
      return;
    }
    animate(scope.current, { fontSize: ['20px', '30px', '28px', '20px'] }, { duration: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, firedPostCount, scope]);

  return (
    <>
      <Flex w="100%" justifyContent="space-between">
        <Box>
          <Box onClick={toggleAutoFiring} cursor="pointer">
            <IconText Icon={BsFire} text="自動で燃やす" />
            <Flex alignItems="center" gap={2}>
              <Switch id="isChecked" colorScheme="pink" isChecked={isAutoFiring} onChange={toggleAutoFiring} />
              <Text>{isAutoFiring ? 'ON' : 'OFF'}</Text>
            </Flex>
          </Box>
        </Box>
        <Link href={Routes.posts.index}>
          <Flex flexDirection="column" alignItems="flex-end">
            <Flex fontSize={14} alignItems="center">
              累計グチ数:
              <Flex
                fontSize={20}
                ml={2}
                w={firedPostCount.toString().length * 3}
                h="24px"
                ref={scope}
                alignItems="center"
                justifyContent="flex-end"
              >
                {firedPostCount}
              </Flex>
            </Flex>
            <Box textDecoration="underline">
              <IconText Icon={PageIcons.posts.index} text="グチ履歴を見る" fontSize={16} />
            </Box>
          </Flex>
        </Link>
      </Flex>
    </>
  );
};

export type TPost = {
  tId: number;
  text: string | undefined;
  emotion: TEmotion;
  imageBase64: string | undefined;
  imageUrl: string | undefined;
};

export type TPostInput = Omit<TPost, 'tId'>;

export type TFiredPost = TPost & {
  isHidden: boolean;
  burnoutSec: number;
};

const Post = () => {
  const { isLoggedIn } = useContext(TokenContext);
  const { createPost } = usePostBackend();
  const { firedPostCountDB } = useFiredPostCount();

  const [posts, setPosts] = useState<TPost[]>([]);
  const [firedPosts, setFiredPosts] = useState<TFiredPost[]>([]);

  const firedPostRef = React.useRef<TPost[]>([]);
  firedPostRef.current = firedPosts;

  const [isAutoFiring, setIsAutoFiring] = useState<boolean>(
    localStorage.getItem(LS_IS_AUTO_FIRING) === 'false' ? false : true,
  );

  const toggleAutoFiring = useCallback(() => {
    setIsAutoFiring((isAutoFiring) => {
      const newIsAutoFiring = !isAutoFiring;
      localStorage.setItem(LS_IS_AUTO_FIRING, newIsAutoFiring ? 'true' : 'false');
      return newIsAutoFiring;
    });
  }, []);

  const updatePost = useCallback(
    (post: TPost, editedPost: TPostInput) => {
      const index = posts.findIndex((p) => p.tId === post.tId);

      if (index === -1) {
        throw new Error('編集対象のグチIDが見つかりませんでした');
      }
      setPosts((posts) => {
        return posts.map((p, i) => (i == index ? { ...editedPost, tId: post.tId } : p));
      });
    },
    [posts],
  );

  const deletePost = useCallback((postId: number) => {
    setPosts((posts) => posts.filter((post) => post.tId !== postId));
  }, []);

  const hideFiredPost = useCallback((id: number) => {
    const index = firedPostRef.current.findIndex((post) => post.tId === id);
    setFiredPosts((posts) =>
      posts.reduce<TFiredPost[]>((acc, post, i) => {
        if (i === index) {
          return [...acc, { ...post, isHidden: true }];
        } else {
          return [...acc, post];
        }
      }, []),
    );
  }, []);

  const addFireArea = useCallback(
    async (post: TPost) => {
      const MIN_BURNOUT_SEC = 2;
      const MAX_BURNOUT_SEC = 3;
      const BURNING_SEC_PER_CHAR = 0.01;

      const firedPostBurnoutSec = Math.min(
        MIN_BURNOUT_SEC + (post.text?.length || 0) * BURNING_SEC_PER_CHAR,
        MAX_BURNOUT_SEC,
      );
      const after = firedPostBurnoutSec * 1000;
      setFiredPosts((posts) => [...posts, { ...post, isHidden: false, burnoutSec: firedPostBurnoutSec }]);
      setTimeout(() => {
        hideFiredPost(post.tId);
      }, after);

      const now = new Date();
      await insertPostDB(post, now);
      localStorage.setItem(LS_IS_POSTED, 'true');

      if (isLoggedIn) {
        const result = await createPost(post);
        if (!result) {
          console.error('グチの投稿に失敗しました。ローカルストレージに保存します');
          return;
        }
        await deletePostDB(getUnixMs(now));
      }
    },
    [createPost, hideFiredPost, isLoggedIn],
  );

  const moveToFire = useCallback(
    (postId: number) => {
      const post = findPostById(posts, postId);
      addFireArea(post);
      deletePost(postId);
    },
    [addFireArea, deletePost, posts],
  );

  const mainRef = React.useRef<HTMLDivElement>(null);

  const sendPost = useCallback(
    (newPost: TPostInput) => {
      if (isAutoFiring) {
        addFireArea({ ...newPost, tId: generateRandomId() });
        return;
      }

      if (posts.length >= MAX_STAGING_POST_COUNT) {
        alert(
          `エラー: 溜まっているグチをドラッグして燃やしてください。一度に溜められるグチは${MAX_STAGING_POST_COUNT}個までです。`,
        );
        return;
      }
      setPosts((posts) => [...posts, { ...newPost, tId: generateRandomId() }]);
    },
    [addFireArea, isAutoFiring, posts.length],
  );

  useEffect(() => {
    const handlePageScroll = (e: TouchEvent) => {
      e.preventDefault();
    };
    mainRef.current?.addEventListener('touchmove', handlePageScroll, { passive: false });
    return () => {
      window.removeEventListener('touchmove', handlePageScroll);
    };
  }, []);

  const firedPostCount = useMemo(
    () => firedPosts.filter((post) => post.isHidden).length + firedPostCountDB,
    [firedPostCountDB, firedPosts],
  ); // 燃え尽きた瞬間にカウントアップする場合はこちら

  return (
    <MainLayout>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend} options={{ enableMouseEvents: true }}>
        <Flex h="100%" flexDirection="column" ref={mainRef}>
          <StatusBar
            firedPostCount={firedPostCount}
            isAutoFiring={isAutoFiring}
            toggleAutoFiring={toggleAutoFiring}
          ></StatusBar>
          <Box flex="1 1 auto" overflow="auto" h="100%">
            <Posts
              posts={posts}
              updatePost={updatePost}
              deletePost={deletePost}
              moveToFire={moveToFire}
              firedPosts={firedPosts}
            />
          </Box>
          <PostInput sendPost={sendPost} />
        </Flex>
      </DndProvider>
    </MainLayout>
  );
};

export default Post;

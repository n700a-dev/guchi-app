'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { Text, Box, Flex, Image } from '@chakra-ui/react';
import { XYCoord, useDrag, useDragDropManager, useDragLayer, useDrop } from 'react-dnd';
import { TFiredPost, TPost, TPostInput } from './page';
import { getCursorPosition } from '../functions/postsManipulation';
import { isMobile } from 'react-device-detect';
import { DragArrow } from './dragArrow';
import Linkify from 'linkify-react';
import { LinkifyOptions } from '@/app/utils/linkify';
import { EmotionIndicator } from '../EmotionIndicator';
import { PhotoFrame } from '../PhotoFrame';
import { DeleteIcon } from '@/app/components/Elements/Icons';
import { BsFire } from 'react-icons/bs';
import { PostBackground } from './PostsBackground';
import { ConfirmModal } from '../ConfirmModal';
import { questionBeforeDelete } from '../functions/postConfirmationMessage';

const ITEM_TYPE = 'card';

type TPostCardProps = {
  updatePost?: (post: TPostInput, editedPost: TPostInput) => void;
  deletePost?: () => void;
  order: number;
  post: TPost;
};

type TFiredPostCardProps = { order: number; post: TFiredPost };

const moveToFireThresPx = 50;
const canDropToFireArea = (currentY: number, startY: number) => {
  return startY - currentY > moveToFireThresPx;
};

const PostCard = ({ post, deletePost, order }: TPostCardProps) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      item: post,
      type: ITEM_TYPE,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [],
  );
  // https://note.com/tabelog_frontend/n/nc9870c774386
  useEffect(() => {
    preview(getEmptyImage());
  }, [preview]);

  return (
    <Flex
      ref={drag}
      my={2}
      p={2}
      borderRadius={4}
      boxSizing="border-box"
      bgColor="black.0"
      w="calc(100% - 5px)" // 5pxはbox-shadowの分
      boxShadow="5px 5px 2px rgba(0,0,0,0.3);"
      alignItems="center"
      opacity={isDragging ? 0.3 : 1}
      order={order}
      justifyContent="space-between"
      cursor="pointer"
    >
      <Flex width="100%" alignItems="center">
        <EmotionIndicator emotion={post.emotion} style={{ marginTop: '2px', marginRight: '4px' }} />
        <Flex w="100%">
          <Text flex="1 1 auto" whiteSpace="pre-wrap" wordBreak="break-all" userSelect="none">
            <Linkify options={LinkifyOptions}>{post.text}</Linkify>
          </Text>
          <PhotoFrame image={post.imageBase64} style={{ marginTop: '4px', maxWidth: '50%' }} />
        </Flex>
      </Flex>
      <Flex ml={2} gap={4}>
        {/* {updatePost && <PostEdit sendPost={(editedPost) => updatePost(editedPost, post)} post={post} />} */}
        {deletePost && (
          <ConfirmModal
            ModalOpenTrigger={
              <Box cursor="pointer">
                <DeleteIcon color="gray" borderColor="lightgray" />
              </Box>
            }
            question={questionBeforeDelete(post)}
            onExecText="削除"
            onExec={deletePost}
          ></ConfirmModal>
        )}
      </Flex>
    </Flex>
  );
};

const FiredPostCard = ({ post, order }: TFiredPostCardProps) => {
  return (
    <motion.div
      style={{ display: post.isHidden ? 'none' : 'block', overflow: 'hidden', position: 'absolute', top: 0, zIndex: 2 }}
      animate={{
        height: ['100%', '50%', '25%', '10%'],
        //height: ['100%'],
      }}
      transition={{
        ease: 'linear',
        duration: post.burnoutSec,
      }}
    >
      <motion.div
        style={{ borderRadius: 4 }}
        animate={{
          opacity: [0.9, 0.7, 0.4],
          backgroundColor: ['#FFFFFF', '#cccccc', '#aaaaaa', '#888888'],
        }}
        transition={{
          ease: 'linear',
          duration: post.burnoutSec,
        }}
      >
        <Flex
          my={2}
          p={2}
          borderColor="#FFDAD0"
          boxSizing="border-box"
          justifyContent="space-between"
          alignItems="center"
          order={order}
          w="100%"
        >
          <EmotionIndicator emotion={post.emotion} style={{ marginTop: '2px', marginRight: '4px' }} />
          <Flex>
            <Text flex="1 1 auto" whiteSpace="pre-wrap" wordBreak="break-all" overflow={'hidden'}>
              <Linkify options={LinkifyOptions}>{post.text}</Linkify>
            </Text>
            <PhotoFrame image={post.imageBase64} style={{ marginTop: '4px', maxWidth: '50%' }} />
          </Flex>
        </Flex>
      </motion.div>
      <Flex position="absolute" bottom="0" color="#FF3419" justifyContent="space-between" w="100%" fontSize={24}>
        <BsFire />
        <BsFire />
        <BsFire />
      </Flex>
    </motion.div>
  );
};

const DraggingPostCardPreview = ({
  startPosition,
  currentPosition,
  canShowPreview,
  posts,
}: {
  startPosition: XYCoord;
  currentPosition: XYCoord;
  canShowPreview: boolean;
  posts: TPost[];
}) => {
  const previewCardRef = useRef<HTMLDivElement>(null);
  const previewCardHeight = previewCardRef?.current?.clientHeight || 0;

  const { item, isDragging }: { item: TPost; isDragging: boolean } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !item || !canShowPreview) {
    return <></>;
  }

  return (
    <>
      <Flex
        position="absolute"
        userSelect="none"
        pointerEvents="none"
        w="100%"
        top={currentPosition.y - previewCardHeight}
        left={0}
        zIndex={1}
        justifyContent="center"
      >
        <Box w="calc(100% - 2rem)" ref={previewCardRef}>
          <PostCard post={posts.find((p) => p.tId === item.tId) || item} order={0} />
        </Box>
      </Flex>
      <Box
        position="absolute"
        userSelect="none"
        pointerEvents="none"
        p={1}
        top={currentPosition.y - 80}
        opacity={0.8}
        left={currentPosition.x}
        zIndex={3}
        display={canDropToFireArea(currentPosition.y, startPosition.y) ? 'block' : 'none'}
        bgColor="gray"
        color="black.0"
        borderRadius={4}
      >
        <Flex gap={1} justifyContent="center" alignItems="center">
          指を離して燃やす
          <BsFire />
        </Flex>
      </Box>
      <Box
        position="absolute"
        userSelect="none"
        pointerEvents="none"
        top={currentPosition.y}
        left={currentPosition.x}
        height={Math.abs(currentPosition.y - startPosition.y)}
        zIndex={2}
      >
        <DragArrow />
      </Box>
    </>
  );
};

type TPostsProps = {
  posts: TPost[];
  deletePost: (index: number) => void;
  moveToFire: (index: number) => void;
  firedPosts: TFiredPost[];
  updatePost: (post: TPost, editedPost: TPostInput) => void;
};

const Posts = ({ posts, deletePost, updatePost, moveToFire, firedPosts }: TPostsProps) => {
  const startPosition = useRef<XYCoord>({ x: 0, y: 0 });
  const currentPosition = useRef<XYCoord>({ x: 0, y: 0 });
  const [dragCount, setDragCount] = useState<number>(0);

  const monitor = useDragDropManager().getMonitor();
  const isShowBackgroundNavi =
    useMemo(() => posts.length > 0 && firedPosts.length < 1, [firedPosts.length, posts.length]) &&
    !monitor.isDragging();

  const [, drop] = useDrop(
    () => ({
      accept: ITEM_TYPE,
      canDrop: () => {
        return true;
      },
      drop: (item: TPost) => {
        if (canDropToFireArea(currentPosition.current.y, startPosition.current.y)) {
          moveToFire(item.tId);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [posts],
  );

  const generateUpdatePostFunction = useCallback(
    (post: TPost) => {
      return (editedPost: TPostInput) => updatePost(post, editedPost);
    },
    [updatePost],
  );
  useEffect(() => {
    const handleCursorPosition = (e: MouseEvent | TouchEvent) => {
      setDragCount((count) => count + 1);
      const { x: newX, y: newY } = getCursorPosition(e);

      currentPosition.current = {
        x: newX > 10 ? newX : currentPosition.current.x,
        y: newY > 10 ? newY : currentPosition.current.y,
      };
    };

    const handleDragStart = (e: MouseEvent | TouchEvent) => {
      startPosition.current = getCursorPosition(e);
      setDragCount(0);
    };

    isMobile
      ? window.addEventListener('touchmove', handleCursorPosition)
      : window.addEventListener('drag', handleCursorPosition);

    isMobile
      ? window.addEventListener('touchstart', handleDragStart)
      : window.addEventListener('dragstart', handleDragStart);

    return () => {
      window.removeEventListener('touchmove', handleCursorPosition);
      window.removeEventListener('drag', handleCursorPosition);
      window.removeEventListener('touchstart', handleDragStart);
      window.removeEventListener('dragstart', handleDragStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canShowPreview = dragCount > 5;

  return (
    <Flex flexDirection="column" h="100%" ref={drop}>
      <DraggingPostCardPreview
        startPosition={startPosition.current}
        currentPosition={currentPosition.current}
        canShowPreview={canShowPreview}
        posts={posts}
      />
      <Flex
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="column-reverse"
        position="relative"
        mb={2}
        h="40%"
        overflow="hidden"
      >
        <Flex position="absolute" justifyContent="center" h="100%" w="100%" pointerEvents="none">
          <Box
            background="gray"
            width="200px"
            height="50px"
            bottom="0"
            position="absolute"
            zIndex={0}
            borderRadius="50%"
          />
          <Image pt={6} src="/fire_image.gif" alt="fire" h="100%" className="image-prohibited-drag" zIndex={1} />
        </Flex>
        {firedPosts.map((post, index) => {
          return <FiredPostCard key={index} order={-index} post={post} />;
        })}
      </Flex>
      <Box h="60%" position="relative" w="100%" userSelect="none" bottom={0} mb={6}>
        {isShowBackgroundNavi && <PostBackground />}
        <Flex h="100%" flexDirection="column-reverse" overflow="auto">
          {posts.map((post, index) => {
            return (
              <Box key={post.tId} zIndex={0}>
                <PostCard
                  order={-index}
                  updatePost={generateUpdatePostFunction(post)}
                  deletePost={() => deletePost(post.tId)}
                  post={post}
                />
              </Box>
            );
          })}
        </Flex>
      </Box>
    </Flex>
  );
};

export default Posts;

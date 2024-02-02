'use client';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useGetDailyPosts } from '../hooks/api/useGetDailyPosts';
import { useGetPostedDatesBackend, useGetPostedDatesFrontend } from '../hooks/api/useGetPostedDates';
import PostManipulationProvider, { PostManipulationContext } from './providers/PostManipulationProvider';
import { IPostDB, IPostedDateDB } from '../../../app/utils/db';

import OpenCloseProvider, { OpenCloseContext } from './providers/OpenCloseProvider';
import { useThisMonth } from '../hooks/useThisMonth';
import RepoStrategyProvider, { RepoStrategy, RepoStrategyContext } from './providers/RepoStrategyProvider';
import MainLayout from '../../../app/MainLayout';
import { LoadingSpinner } from '../../../app/components/Elements/Loadings';
import { LinkifyOptions } from '../../../app/utils/linkify';
import Linkify from 'linkify-react';
import { EmotionIndicator } from '../EmotionIndicator';
import { PhotoFrame } from '../PhotoFrame';
import { PhotoZoomModal } from '../PhotoZoomModal';
import { StatusBar } from './StatusBar';
import StrageCredentialProvider from './providers/StrageCredentialProvider';

import { MdPhoneAndroid } from 'react-icons/md';
import { IoCloudDoneOutline } from 'react-icons/io5';
import { IconText } from '../../components/Elements/Texts';
import { StartPostButton } from '../StartPostButton';
import { TokenContext } from '../../../app/providers/TokenProvider';
import { Routes } from '../../../config/routes';

import { getPostCountDB } from '../functions/postDBManipulation';
import { NoPostFoundPanel } from './NoPostFoundPanel';
import { NotLoggedInPanel } from './NotLoggedInPanel';
import { PostEditMenu } from './PostEditMenu';
import { AllCloseFloatingButton } from './AllCloseFloatingButton';

const TODAY = new Date();

const D = ({ post }: { post: IPostDB }) => {
  const image = useMemo(() => {
    if (post.imageBase64) {
      return post.imageBase64;
    }
    if (post.imageUrl) {
      return post.imageUrl;
    }

    return undefined;
  }, [post.imageBase64, post.imageUrl]);

  const isFetching = false;

  return (
    <>
      {isFetching ? (
        <LoadingSpinner />
      ) : (
        <>
          <Flex alignItems="center">
            <EmotionIndicator emotion={post.emotion} hasBlankSpace style={{ fontSize: 20, marginRight: '4px' }} />
            <Box p={2} my={1} bgColor="black.0" borderRadius={4} w="100%">
              <Flex justifyContent="space-between" alignItems="center">
                <Text whiteSpace="pre-wrap" wordBreak="break-all">
                  <Linkify options={LinkifyOptions}>{post.text}</Linkify>
                </Text>
                <Flex ml={1} gap={2}>
                  <PostEditMenu post={post} />
                </Flex>
              </Flex>
              <>
                {image && (
                  <PhotoZoomModal image={image}>
                    <PhotoFrame image={image} style={{ marginTop: image && '8px', padding: 0 }} />
                  </PhotoZoomModal>
                )}
              </>
            </Box>
          </Flex>
        </>
      )}
    </>
  );
};
const Daily = ({ postedDate }: { postedDate: IPostedDateDB }) => {
  const { strategy } = useContext(RepoStrategyContext);

  const { dailyPosts, fetchPosts } = useGetDailyPosts({
    postedDate,
    strategy,
  });

  const { openCloseStatus, toggleOpenClose } = useContext(OpenCloseContext);

  const isOpen = useMemo(() => {
    return openCloseStatus[postedDate.postedDate];
  }, [openCloseStatus, postedDate.postedDate]);

  useEffect(() => {
    if (!isOpen) return;
    fetchPosts();
  }, [fetchPosts, isOpen]);

  return (
    <Box display={!postedDate.postCount ? 'none' : undefined}>
      <AccordionItem>
        <AccordionButton
          position="sticky"
          top={-4}
          p={0}
          onClick={() => toggleOpenClose(postedDate.postedDate)}
          zIndex={1}
        >
          <Flex w="100%" p={2} py={3} alignItems="center" bgColor="lightgray">
            <Flex w="100%" alignItems="center">
              <Text fontSize={16} fontWeight={700}>
                {postedDate.postedDate}
              </Text>
              <Text pl={4}>{postedDate.postCount}件</Text>
            </Flex>
            <AccordionIcon />
          </Flex>
        </AccordionButton>
        <AccordionPanel pt={0} pb={4} pl={2}>
          {dailyPosts?.map((post) => (
            <Box key={post.createdAtMs}>
              <D post={post} />
            </Box>
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Box>
  );
};

const Com = () => {
  const { postedDates, createPost } = useContext(PostManipulationContext);

  const { openCloseStatus, closeAll } = useContext(OpenCloseContext);

  const expandedIndices = useMemo(
    () =>
      postedDates.reduce<number[]>((acc, pd, index) => {
        return openCloseStatus[pd.postedDate] ? [...acc, index] : acc;
      }, []),
    [openCloseStatus, postedDates],
  );

  const onClickAllClose = useCallback(() => {
    closeAll();
  }, [closeAll]);

  if (!createPost) {
    return <></>;
  }
  return (
    <Box>
      <Accordion index={expandedIndices} allowMultiple>
        {postedDates?.map((pd) => <Daily postedDate={pd} key={pd.updatedAtMs} />)}
      </Accordion>
      <Box w="100%" h="32px"></Box> {/* 全て閉じるボタンの領域とグチのカードが干渉しないためのダミー要素 */}
      {!!expandedIndices.length && <AllCloseFloatingButton onClick={onClickAllClose} />}
    </Box>
  );
};
const Repo = ({
  postedDates,
  strategy, //postCount,
  monthlyPostCount,
}: {
  postedDates: IPostedDateDB[];
  strategy: (typeof RepoStrategy)[keyof typeof RepoStrategy];
  monthlyPostCount: number;
}) => {
  return (
    <>
      {monthlyPostCount === 0 ? (
        <Box mt={6}>今月のグチはありません</Box>
      ) : (
        <StrageCredentialProvider>
          <RepoStrategyProvider strategy={strategy}>
            <PostManipulationProvider initPostedDates={postedDates} strategy={strategy}>
              <OpenCloseProvider postedDates={postedDates}>
                <Com />
              </OpenCloseProvider>
            </PostManipulationProvider>
          </RepoStrategyProvider>
        </StrageCredentialProvider>
      )}
    </>
  );
};

const calcPostCount = (postedDates: IPostedDateDB[]) => {
  return postedDates.reduce((acc, pd) => acc + pd.postCount, 0);
};

const Page = () => {
  const { isLoggedIn } = useContext(TokenContext);
  const [localPostCount, setLocalPostCount] = useState(1);

  useEffect(() => {
    getPostCountDB().then((count) => {
      setLocalPostCount(count);
    });
  }, []);

  // TOOD: localとremoteの切り替え用UIを作る
  const { thisYearMonth, toPrevMonth, toNextMonth } = useThisMonth(TODAY);

  // 初期値(default): 以後再読み込みしない
  const { postedDates: postedDatesBackend } = useGetPostedDatesBackend(thisYearMonth);
  const { postedDates: postedDatesFrontend } = useGetPostedDatesFrontend(thisYearMonth);

  const monthlyPostCountBackend = useMemo(() => {
    return calcPostCount(postedDatesBackend);
  }, [postedDatesBackend]);

  const monthlyPostCountFrontend = useMemo(() => {
    return calcPostCount(postedDatesFrontend);
  }, [postedDatesFrontend]);

  const isLocalTabVisible = !isLoggedIn || monthlyPostCountFrontend > 0;
  const defaultIndex = isLoggedIn ? 1 : 0;

  return (
    <MainLayout>
      <Flex flexDirection="column" h="100%">
        <StatusBar yearMonth={thisYearMonth} toPrevMonth={toPrevMonth} toNextMonth={toNextMonth} />
        <Box width="100%" my={4}>
          <StartPostButton href={Routes.posts.new} />
        </Box>
        <Box flex="1 1 auto" py={4}>
          <Tabs variant="enclosed" defaultIndex={defaultIndex}>
            <TabList>
              <Tab _selected={{ backgroundColor: 'black.0' }} display={isLocalTabVisible ? 'block' : 'none'}>
                <IconText Icon={MdPhoneAndroid} text={`この端末 (${monthlyPostCountFrontend})`} />
              </Tab>
              <Tab _selected={{ backgroundColor: 'black.0' }}>
                <IconText Icon={IoCloudDoneOutline} text={`クラウド (${monthlyPostCountBackend})`} />
              </Tab>
            </TabList>
            {/* ローカルのグチ履歴 */}
            <TabPanels>
              <TabPanel p={0}>
                {localPostCount === 0 ? (
                  <NoPostFoundPanel />
                ) : (
                  <Repo
                    strategy={RepoStrategy.local}
                    postedDates={postedDatesFrontend}
                    monthlyPostCount={monthlyPostCountFrontend}
                  />
                )}
              </TabPanel>
              {/* リモートのグチ履歴 */}
              <TabPanel p={0}>
                {isLoggedIn ? (
                  <Repo
                    strategy={RepoStrategy.remote}
                    postedDates={postedDatesBackend}
                    monthlyPostCount={monthlyPostCountBackend}
                  />
                ) : (
                  <NotLoggedInPanel />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </MainLayout>
  );
};
export default Page;

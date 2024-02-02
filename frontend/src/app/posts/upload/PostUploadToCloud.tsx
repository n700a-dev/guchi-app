'use client';

import { Text, Link, Box, Flex, Button, Progress, Stack } from '@chakra-ui/react';
import React from 'react';

import { useUploadPostToCloud } from './hooks/useUploadPostToCloud';
import { IconText } from '@/app/components/Elements/Texts';
import { IoCloudDoneOutline, IoCloudUploadOutline } from 'react-icons/io5';
import { PageIcons, Routes } from '../../../config/routes';
import { LoadingSpinner } from '@/app/components/Elements/Loadings';

export const PostUploadToCloud = () => {
  const { startUpload, abortUpload, totalCount, currentCount, uploadStatus } = useUploadPostToCloud();
  return (
    <>
      <Box mt={2}>
        {uploadStatus === 'finished' ? (
          <IconText
            Icon={IoCloudDoneOutline}
            text="端末内のグチをクラウドに保存しました!"
            fontSize={16}
            cursor="auto"
          />
        ) : (
          <IconText Icon={IoCloudUploadOutline} text="端末内のグチをクラウドに保存します" fontSize={16} cursor="auto" />
        )}
      </Box>
      <Box mt={4}>
        {uploadStatus === 'waiting' && <Button onClick={startUpload}>スタート</Button>}
        {uploadStatus !== 'waiting' && uploadStatus !== 'finished' && (
          <Flex h="40px">
            <Button onClick={abortUpload} mr={2} borderColor="lightgray">
              中止
            </Button>
            <LoadingSpinner style={{ height: '80%' }} />
          </Flex>
        )}
        {uploadStatus !== 'waiting' && (
          <Box mt={4}>
            <Progress hasStripe value={(currentCount / totalCount) * 100} />
            <Text>
              {currentCount}/{totalCount}: {uploadStatus}
            </Text>
          </Box>
        )}
        {uploadStatus === 'failed' && (
          <Box mt={4}>
            <Text>クラウドへのアップロードに失敗しました。時間を空けて再度やり直してください。</Text>
            <Link href={Routes.inquiry.googleForm} target="_blank">
              <IconText Icon={PageIcons.inquiry.googleForm} text="お問い合わせ" />
            </Link>
          </Box>
        )}
        {uploadStatus === 'finished' && (
          <Box mt={4}>
            <Stack spacing={2}>
              <Link href={Routes.posts.index}>
                <IconText Icon={PageIcons.posts.index} text="グチ履歴へ" fontSize={16} />
              </Link>
              <Link href={Routes.posts.analysis}>
                <IconText Icon={PageIcons.posts.analysis} text="グチ分析へ" fontSize={16} />
              </Link>
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
};

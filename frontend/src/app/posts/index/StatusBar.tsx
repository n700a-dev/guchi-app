import { Flex, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { TYearMonth } from '../hooks/useThisMonth';
import { getThisMonth, getThisYear } from '@/app/utils/datetime';
import Link from 'next/link';
import { IconText } from '@/app/components/Elements/Texts';
import { PageIcons, Routes } from '../../../config/routes';

const TODAY = new Date();

type TStatusBarProps = {
  yearMonth: TYearMonth;
  toPrevMonth: () => void;
  toNextMonth: () => void;
};

export const StatusBar = ({ yearMonth, toPrevMonth, toNextMonth }: TStatusBarProps) => {
  const isLatestMonth = useMemo(() => {
    if (yearMonth.year === getThisYear(TODAY) && yearMonth.month === getThisMonth(TODAY)) return true;
    return false;
  }, [yearMonth.month, yearMonth.year]);

  return (
    <Flex w="100%" justifyContent="flex-start" alignItems="center" columnGap={6} rowGap={2} flexWrap="wrap">
      <Text fontSize={24}>{yearMonth.month}月のグチ履歴</Text>
      <Flex flexDirection="column" alignItems="flex-end">
        <Flex alignItems="center" justifyContent="flex-end" gap={4} fontSize={16} w="100%">
          <Text cursor="pointer" onClick={() => toPrevMonth()}>
            &lt; 前月
          </Text>
          <Text
            color={isLatestMonth ? 'gray' : undefined}
            cursor="pointer"
            onClick={() => !isLatestMonth && toNextMonth()}
          >
            翌月 &gt;
          </Text>
        </Flex>
      </Flex>
      <Link href={Routes.posts.upload}>
        <IconText Icon={PageIcons.posts.upload} text="クラウドに保存" fontSize={16} />
      </Link>
      <Link href={Routes.posts.analysis}>
        <IconText Icon={PageIcons.posts.analysis} text="グチ分析" fontSize={16} />
      </Link>
    </Flex>
  );
};

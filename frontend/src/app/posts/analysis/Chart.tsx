import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { useThisMonth } from '../hooks/useThisMonth';
import { useDailyEmotionCountsQuery } from '../../../gql/graphql';
import { getEndDayOfMonth, ymdToDate } from '../../utils/datetime';
import { getDatehyphenatedString } from '@/app/utils/datetime';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { IconText } from '../../components/Elements/Texts';
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from 'react-icons/fa';
import { PiNoteLight } from 'react-icons/pi';
import { RiEmotionHappyLine } from 'react-icons/ri';

// 積み上げ棒グラフ
// https://recharts.org/en-US/api/ResponsiveContainer

// 集計
// select posted_date, emotion, count(*) from posts group by posted_date, emotion order by posted_date asc;

const cutDecimalPoint = (num: number) => {
  return Math.floor(num * 100) / 100;
};

type TDailyPostSummary = {
  day: number;
  postedDate: string;
  postCount: number;
  happyCount: number;
  angryCount: number;
  sadCount: number;
  tiredCount: number;
  noneCount: number;
};
const TODAY = new Date();
export const Chart = () => {
  const { thisYearMonth, toPrevMonth, toNextMonth } = useThisMonth(TODAY);

  const [{ data: dataEmotion }] = useDailyEmotionCountsQuery({
    variables: {
      year: thisYearMonth.year,
      month: thisYearMonth.month,
    },
  });

  const prototypeDailyPostSummarys = (year: number, month: number) => {
    const endDate = getEndDayOfMonth({ year, month }).getDate();

    const tmpPostedDates: TDailyPostSummary[] = [];
    for (let day = 1; day <= endDate; day++) {
      const dayDate = ymdToDate(year, month, day);
      tmpPostedDates.push({
        day: day,
        postedDate: getDatehyphenatedString(dayDate),
        postCount: 0,
        happyCount: 0,
        angryCount: 0,
        sadCount: 0,
        tiredCount: 0,
        noneCount: 0,
      });
    }
    return tmpPostedDates;
  };

  const graphData = prototypeDailyPostSummarys(thisYearMonth.year, thisYearMonth.month);
  // APIから取得したデータをマージする

  if (dataEmotion) {
    dataEmotion.dailyEmotionCounts.forEach((daily) => {
      const index = graphData.findIndex((p) => p.postedDate === daily.postedDate);
      if (index === -1) return;

      switch (daily.emotion) {
        case 'happy':
          graphData[index].happyCount = daily.emotionCount;
          break;
        case 'angry':
          graphData[index].angryCount = daily.emotionCount;
          break;
        case 'sad':
          graphData[index].sadCount = daily.emotionCount;
          break;
        case 'tired':
          graphData[index].tiredCount = daily.emotionCount;
          break;
        default:
          graphData[index].noneCount = daily.emotionCount;
          break;
      }
    });
  }

  graphData.forEach((d) => {
    d.postCount = d.happyCount + d.angryCount + d.sadCount + d.tiredCount + d.noneCount;
    if (d.postCount === 0) return;
    d.happyCount = cutDecimalPoint((d.happyCount / d.postCount) * 100);
    d.angryCount = cutDecimalPoint((d.angryCount / d.postCount) * 100);
    d.sadCount = cutDecimalPoint((d.sadCount / d.postCount) * 100);
    d.tiredCount = cutDecimalPoint((d.tiredCount / d.postCount) * 100);
    d.noneCount = cutDecimalPoint((d.noneCount / d.postCount) * 100);
  });

  const totalCount = useMemo(() => graphData.reduce<number>((acc, cur) => acc + cur.postCount, 0), [graphData]);

  console.log(graphData);
  return (
    <>
      <Flex justifyContent="center" gap={4}>
        <IconText Icon={FaRegArrowAltCircleLeft} text="前月" onClick={toPrevMonth} />
        <Heading as="h1" fontSize="20px">
          {thisYearMonth.month}月のレポート
        </Heading>
        <IconText Icon={FaRegArrowAltCircleRight} text="翌月" onClick={toNextMonth} />
      </Flex>
      <Box height={4}></Box>
      <Flex>
        <IconText Icon={PiNoteLight} text="投稿数" />: {totalCount}
      </Flex>
      <Box p={4} borderRadius={8} bgColor="black.0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graphData}>
            <CartesianGrid />
            <XAxis
              dataKey="day"
              interval={1}
              fontSize={12}
              label={{
                value: '日付',
                position: 'insideBottom',
                dy: 7,
              }}
            />
            <YAxis
              label={{
                value: '件',
                position: 'insideTopLeft',
                offset: 5,
                dx: 30,
                dy: 10,
              }}
            />
            <Bar dataKey="postCount" stackId="a" fill="#8884d8" />
            {/* <Bar dataKey="y" stackId="a" fill="#82ca9d" /> */}
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box height={4}></Box>
      <IconText Icon={RiEmotionHappyLine} text="感情の変化" />
      <Box p={4} borderRadius={8} bgColor="black.0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graphData}>
            <CartesianGrid />
            <XAxis
              dataKey="day"
              interval={1}
              fontSize={12}
              label={{
                value: '日付',
                position: 'insideBottom',
                dy: 7,
              }}
            />
            <YAxis
              label={{
                value: '%',
                position: 'insideTopLeft',
                offset: 5,
                dx: 30,
                dy: 10,
              }}
              domain={[0, 100]}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="noneCount" stackId="emotion" fill="#eeeeee" name="なし" />
            <Bar dataKey="tiredCount" stackId="emotion" fill="#00bbFF" name="疲れた" />
            <Bar dataKey="sadCount" stackId="emotion" fill="#0008FF" name="悲しい" />
            <Bar dataKey="angryCount" stackId="emotion" fill="#F75E25" name="怒った" />
            <Bar dataKey="happyCount" stackId="emotion" fill="#EDDF1E" name="うれしい" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box height={6}></Box>
    </>
  );
};

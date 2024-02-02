import { IPostedDateDB } from '../../../../app/utils/db';
import { usePostedDatesQuery } from '../../../../gql/graphql';
import { TYearMonth } from '../useThisMonth';
import { useEffect, useState } from 'react';
import {
  getEndDayOfMonth,
  getEndOfTheDay,
  getTimezoneDiffHour,
  getUnixMs,
  ymdToDate,
} from '../../../../app/utils/datetime';
import { postedDatesInTheMonthDB } from '../../functions/postDBManipulation';
import { getDatehyphenatedString } from '@/app/utils/datetime';

const prototypePostedDates = (year: number, month: number) => {
  const endDate = getEndDayOfMonth({ year, month }).getDate();

  const tmpPostedDates: IPostedDateDB[] = [];
  for (let day = endDate; day >= 1; day--) {
    const dayDate = ymdToDate(year, month, day);
    tmpPostedDates.push({
      postedDate: getDatehyphenatedString(dayDate),
      postCount: 0,
      startOfDayMs: getUnixMs(getEndOfTheDay(dayDate)),
      endOfDayMs: getUnixMs(getEndOfTheDay(dayDate)),
      updatedAtMs: getUnixMs(dayDate),
      diffHour: getTimezoneDiffHour(),
    });
  }
  return tmpPostedDates;
};

export const useGetPostedDatesBackend = ({ year, month }: TYearMonth) => {
  const [fetchedYearMonth, setFetchedYearMonth] = useState<TYearMonth | undefined>(undefined);
  const [postedDates, setPostedDates] = useState<IPostedDateDB[]>([]);

  const [{ data }] = usePostedDatesQuery({
    variables: {
      year,
      month,
    },
  });

  useEffect(() => {
    setFetchedYearMonth({ year, month });

    const proto = prototypePostedDates(year, month);
    // APIから取得したデータをマージする
    data?.postedDates.forEach((postedDate) => {
      const index = proto.findIndex((p) => p.postedDate === postedDate.postedDate);
      if (index !== -1) {
        const p = proto[index];
        proto[index] = {
          ...p,
          postCount: p.postCount + postedDate.postCount,
        };
      }
    });

    setPostedDates(proto);
  }, [data, fetchedYearMonth?.month, fetchedYearMonth?.year, month, year]);

  return {
    postedDates,
  };
};

export const useGetPostedDatesFrontend = ({ year, month }: TYearMonth) => {
  const [fetchedYearMonth, setFetchedYearMonth] = useState<TYearMonth | undefined>(undefined);
  const [postedDates, setPostedDates] = useState<IPostedDateDB[]>([]);
  const [postedDatesDB, setPostedDatesDB] = useState<IPostedDateDB[]>([]);

  useEffect(() => {
    if (fetchedYearMonth?.year === year && fetchedYearMonth?.month === month) {
      console.log('Already fetched yearmonth');
      return;
    }
    setFetchedYearMonth({ year, month });

    postedDatesInTheMonthDB({ year, month }).then((data) => {
      setPostedDatesDB(data);
    });
  }, [fetchedYearMonth?.month, fetchedYearMonth?.year, month, year]);

  useEffect(() => {
    const proto = prototypePostedDates(year, month);
    // APIから取得したデータをマージする
    postedDatesDB.forEach((postedDate) => {
      const index = proto.findIndex((p) => p.postedDate === postedDate.postedDate);
      if (index !== -1) {
        const p = proto[index];
        proto[index] = {
          ...p,
          postCount: p.postCount + postedDate.postCount,
        };
      }
    });

    setPostedDates(proto);
  }, [postedDatesDB, month, year]);

  return {
    postedDates,
  };
};

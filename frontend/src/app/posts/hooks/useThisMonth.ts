import { getThisMonth, getThisYear } from '../../utils/datetime';
import { useMemo, useReducer } from 'react';

const JANUALY = 1;
const DECEMBER = 12;

export type TYearMonth = {
  year: number;
  month: number;
};

type TAction = 'prevMonth' | 'nextMonth';

const prevMonth = (yearMonth: TYearMonth): TYearMonth => {
  const prevYear = yearMonth.month - 1 < JANUALY ? yearMonth.year - 1 : yearMonth.year;
  const prevMonth = yearMonth.month - 1 < JANUALY ? DECEMBER : yearMonth.month - JANUALY;
  return {
    year: prevYear,
    month: prevMonth,
  };
};

export const nextMonth = (yearMonth: TYearMonth): TYearMonth => {
  const nextYear = yearMonth.month + 1 > DECEMBER ? yearMonth.year + 1 : yearMonth.year;
  const nextMonth = yearMonth.month + 1 > DECEMBER ? JANUALY : yearMonth.month + 1;
  return {
    year: nextYear,
    month: nextMonth,
  };
};

const reducerFunc = (thisYearMonth: TYearMonth, action: TAction): TYearMonth => {
  switch (action) {
    case 'prevMonth':
      return prevMonth(thisYearMonth);
    case 'nextMonth': {
      return nextMonth(thisYearMonth);
    }
    default:
      throw new Error("reducerFunc: action doesn't exist");
  }
};

export const useThisMonth = (initialDate: Date) => {
  const initialYearMonth: TYearMonth = {
    year: getThisYear(initialDate),
    month: getThisMonth(initialDate),
  };

  const [thisYearMonth, dispatch] = useReducer(reducerFunc, initialYearMonth);

  const nextYearMonth = useMemo(() => nextMonth(thisYearMonth), [thisYearMonth]);

  return {
    thisYearMonth,
    nextYearMonth,
    toPrevMonth: () => dispatch('prevMonth'),
    toNextMonth: () => dispatch('nextMonth'),
  };
};

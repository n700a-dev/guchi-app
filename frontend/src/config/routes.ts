import { IconType } from 'react-icons';
import { CgNotes } from 'react-icons/cg';
import { FaRegChartBar, FaRegCommentDots } from 'react-icons/fa';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import { GoGear, GoLog } from 'react-icons/go';
import { IoArrowUndoOutline, IoCloudUploadOutline } from 'react-icons/io5';
import { MdOutlineInstallMobile } from 'react-icons/md';

const INQUIRY_URL = process.env.NEXT_PUBLIC_INQUIRY_URL ?? '';
if (!INQUIRY_URL) {
  throw new Error('INQUIRY_URL is not defined in Environment Variables!');
}

/**
 * 型T(オブジェクト)のValueの型を、型Uに変換する
 * @example TConvertTypeOfValue<{ a: string, b: string }, number> => { a: number, b: number }
 */
type TConvertTypeOfObjectValue<T, U> = T extends object ? { [K in keyof T]: TConvertTypeOfObjectValue<T[K], U> } : U;

export const Routes = {
  top: '/',
  posts: {
    new: '/posts/new',
    index: '/posts/index',
    analysis: '/posts/analysis',
    upload: '/posts/upload',
  },
  settings: {
    root: '/settings',
  },
  terms: {
    root: '/terms',
  },
  install: {
    root: '/install',
  },
  inquiry: {
    googleForm: INQUIRY_URL,
  },
};

type TPageIcons = TConvertTypeOfObjectValue<typeof Routes, IconType>;

export const PageIcons: TPageIcons = {
  top: IoArrowUndoOutline,
  posts: {
    new: FaRegCommentDots,
    index: GoLog,
    analysis: FaRegChartBar,
    upload: IoCloudUploadOutline,
  },
  settings: {
    root: GoGear,
  },
  terms: {
    root: CgNotes,
  },
  install: {
    root: MdOutlineInstallMobile,
  },
  inquiry: {
    googleForm: FaRegCircleQuestion,
  },
};
